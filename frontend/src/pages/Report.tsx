
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issueApi } from '../services/api';
import { DISTRICTS, BLOCKS } from '../types';
import type { IssueCategory } from '../types';
import {
    AlertTriangle,
    MapPin,
    Upload,
    Zap,
    Trash,
    Droplets,
    Car,
    Construction,
    Siren,
    Building2,
    School,
    Stethoscope,
    Home,
    ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';


// Map category to official language
const CATEGORY_LABELS: Record<IssueCategory, string> = {
    'Pothole': 'Road Hazard',
    'Garbage': 'Sanitation',
    'Street Light': 'Lighting',
    'Water Leakage': 'Water Supply',
    'Traffic Violation': 'Traffic',
    'Other': 'Other',
};

const CATEGORY_ICONS: Record<IssueCategory, any> = {
    'Pothole': Construction,
    'Garbage': Trash,
    'Street Light': Zap,
    'Water Leakage': Droplets,
    'Traffic Violation': Car,
    'Other': AlertTriangle,
};

const CONTEXT_OPTIONS = [
    { value: 'residential', label: 'Residential', icon: Home },
    { value: 'school', label: 'School Zone', icon: School },
    { value: 'hospital', label: 'Hospital/Clinic', icon: Stethoscope },
    { value: 'highway', label: 'Major Road/Highway', icon: Siren },
    { value: 'commercial', label: 'Market/Commercial', icon: Building2 },
];

export default function Report() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState({ lat: '', lng: '' });
    const [locationStatus, setLocationStatus] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Pothole' as IssueCategory,
        state: 'Odisha',
        district: '',
        block: '',
        location_context: 'residential'
    });
    const [image, setImage] = useState<File | null>(null);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
                <div className="animate-spin w-6 h-6 border-2 border-neutral-300 border-t-[#0B0D12] rounded-full" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center pt-16">
                <div className="text-center">
                    <p className="text-neutral-600 mb-4">Authentication required to submit reports.</p>
                    <Link to="/login" className="text-[#0B0D12] font-medium hover:underline">
                        Login to continue →
                    </Link>
                </div>
            </div>
        );
    }

    const handleGeoLocate = () => {
        if (navigator.geolocation) {
            setLocationStatus('Detecting...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude.toFixed(6),
                        lng: position.coords.longitude.toFixed(6),
                    });
                    setLocationStatus(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)} `);
                },
                (err) => {
                    setLocationStatus('Access denied: ' + err.message);
                }
            );
        } else {
            setLocationStatus('Geolocation not supported');
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.state) errors.state = 'State is required.';
        if (!formData.district) errors.district = 'District is required.';
        if (!formData.description.trim()) errors.description = 'Description is required.';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title || `${CATEGORY_LABELS[formData.category]} in ${formData.block || formData.district} `);
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('state', formData.state);
            submitData.append('district', formData.district);
            submitData.append('block', formData.block);
            submitData.append('location_context', formData.location_context);
            if (location.lat) submitData.append('latitude', location.lat);
            if (location.lng) submitData.append('longitude', location.lng);
            if (image) submitData.append('image', image);

            const response = await issueApi.submitReport(submitData);
            if (response.redirect) {
                navigate(response.redirect);
            } else if (response.error) {
                setError(response.error);
            } else {
                navigate('/profile');
            }
        } catch {
            setError('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full font-sans text-[#111111] pb-24">
            <div className="max-w-5xl mx-auto space-y-6"> {/* Content Wrapper */}

                {/* HEADING CARD */}
                <div className="bg-white p-8 border border-neutral-200 shadow-sm relative overflow-hidden group rounded-2xl">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#EA580C]" /> {/* Orange aesthetic line */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-1 bg-[#111111] text-white text-[10px] font-bold tracking-widest uppercase">
                                    New Risk Signal
                                </span>
                                <span className="text-[10px] text-neutral-400 font-mono tracking-wide uppercase">
                                    REF-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
                                Report Civic Incident
                            </h1>
                            <p className="text-neutral-500 mt-2 max-w-2xl">
                                Detailed reports help authorities calculate risk and prioritize resources effectively.
                                <span className="hidden sm:inline"> All submissions are verified against the Civic Risk Index.</span>
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* 1. CATEGORY SELECTION */}
                    <div className="bg-white p-6 md:p-8 border border-neutral-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-4 bg-[#111111]" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">Incident Category</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                                // Default to AlertTriangle if icon is missing to prevent crash
                                const Icon = CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS] || AlertTriangle;
                                const isSelected = formData.category === key;

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent accidental form submisson
                                            setFormData(prev => ({ ...prev, category: key as IssueCategory }));
                                        }}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-3 p-4 h-32 transition-all duration-200 relative group cursor-pointer",
                                            "border",
                                            isSelected
                                                ? "bg-[#111111] border-[#111111] text-white shadow-lg scale-[1.02] z-20"
                                                : "bg-white border-neutral-200 hover:border-[#EA580C] text-neutral-600 hover:text-[#EA580C] z-10"
                                        )}
                                    >
                                        <Icon className={cn("w-8 h-8", isSelected ? "text-[#EA580C]" : "group-hover:text-[#EA580C]")} strokeWidth={1.5} />
                                        <span className={cn(
                                            "text-[11px] font-bold uppercase tracking-wider text-center",
                                            isSelected ? "text-white" : "text-neutral-500 group-hover:text-[#EA580C]"
                                        )}>
                                            {label}
                                        </span>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#EA580C] rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. IMPACT CONTEXT */}
                    <div className="bg-white p-6 md:p-8 border border-neutral-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 bg-[#EA580C]" /> {/* Orange accent */}
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">Impact Context</h3>
                        </div>
                        <p className="text-xs text-neutral-400 mb-6 pl-3">Where is this occurring? Helps calculate vulnerability score.</p>

                        <div className="flex flex-wrap gap-3">
                            {CONTEXT_OPTIONS.map((ctx) => {
                                const Icon = ctx.icon;
                                const isSelected = formData.location_context === ctx.value;

                                return (
                                    <button
                                        key={ctx.value}
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setFormData(prev => ({ ...prev, location_context: ctx.value }));
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 px-5 py-3 rounded-none border transition-all duration-200 cursor-pointer",
                                            isSelected
                                                ? "bg-[#EA580C] border-[#EA580C] text-white shadow-md font-bold"
                                                : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-xs uppercase tracking-wide">{ctx.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>


                    {/* 3. LOCATION & EVIDENCE (Grid Layout) */}
                    <div className="grid md:grid-cols-2 gap-6">

                        {/* LEFT: LOCATION */}
                        <div className="bg-white p-6 md:p-8 border border-neutral-200 shadow-sm flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="w-4 h-4 text-neutral-400" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">Location</h3>
                            </div>

                            <div className="space-y-5 flex-1">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">State</label>
                                    <div className="relative">
                                        <select
                                            disabled
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 text-sm appearance-none outline-none text-neutral-500 cursor-not-allowed font-medium"
                                        >
                                            <option>Odisha</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">District</label>
                                    <div className="relative">
                                        <select
                                            value={formData.district}
                                            onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value, block: '' }))}
                                            className="w-full bg-white border border-neutral-200 p-3 text-sm appearance-none outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors"
                                        >
                                            <option value="">Select District</option>
                                            {(DISTRICTS[formData.state] || []).map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-3.5 pointer-events-none text-neutral-400">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">Block / Ward</label>
                                    <div className="relative">
                                        <select
                                            value={formData.block}
                                            onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))}
                                            disabled={!formData.district}
                                            className={cn(
                                                "w-full border p-3 text-sm appearance-none outline-none transition-colors",
                                                !formData.district
                                                    ? "bg-neutral-50 border-neutral-100 text-neutral-300 cursor-not-allowed"
                                                    : "bg-white border-neutral-200 focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
                                            )}
                                        >
                                            <option value="">Select Block/Ward</option>
                                            {formData.district && BLOCKS[formData.district]?.map(b => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-3.5 pointer-events-none text-neutral-400">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGeoLocate}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-dashed border-neutral-300 text-neutral-500 text-xs uppercase font-bold tracking-wider hover:bg-neutral-50 transition-colors"
                                >
                                    <MapPin className="w-3 h-3" />
                                    {locationStatus || "Detect Precise GPS"}
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: EVIDENCE & DESCRIPTION */}
                        <div className="bg-white p-6 md:p-8 border border-neutral-200 shadow-sm flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-6">
                                <Upload className="w-4 h-4 text-neutral-400" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">Evidence</h3>
                            </div>

                            <div className="space-y-5 flex-1">
                                <label className="border-2 border-dashed border-neutral-200 rounded-none h-48 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#EA580C] hover:bg-orange-50/10 transition-colors group">
                                    {image ? (
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-emerald-600 mb-1">Image Selected</p>
                                            <p className="text-xs text-neutral-500">{image.name}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#EA580C] transition-colors">
                                                <Upload className="w-5 h-5 text-neutral-400 group-hover:text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-neutral-700">Click to upload</span>
                                            <span className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wide">JPG, PNG (Max 5MB)</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                                    />
                                </label>
                                {fieldErrors.image && <p className="text-red-500 text-xs mt-1">{fieldErrors.image}</p>}

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Describe the issue..."
                                        className={cn(
                                            "w-full h-32 bg-neutral-50 border p-4 text-sm outline-none focus:bg-white focus:border-[#EA580C] transition-all resize-none",
                                            fieldErrors.description ? "border-red-500" : "border-neutral-200"
                                        )}
                                    />
                                    {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm">
                            <p className="font-bold">Submission Error:</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Submit Bar */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#111111] text-white py-5 text-sm font-bold uppercase tracking-[0.15em] hover:bg-[#EA580C] transition-colors shadow-lg hover:shadow-orange-500/20 active:scale-[0.99] disabled:opacity-70"
                        >
                            {loading ? 'TRANSMITTING...' : 'SUBMIT RISK SIGNAL'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
