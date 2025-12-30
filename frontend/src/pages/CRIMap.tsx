import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// --- DATA TYPES ---
interface CRIData {
    block: string;
    cri: number;
    color: string;
    lat: number;
    lng: number;
}

// --- MOCK DATA SOURCE (In real app, fetch from backend) ---
// Focused on Odisha (Bhubaneswar/Cuttack) as primary demo region
const NATIONAL_OVERVIEW: CRIData[] = [
    { block: 'Bhubaneswar Ward 1', cri: 45, color: 'green', lat: 20.2961, lng: 85.8245 }, // Example Coords
    { block: 'Saheed Nagar', cri: 78, color: 'orange', lat: 20.2900, lng: 85.8450 },
    { block: 'Patia', cri: 82, color: 'red', lat: 20.3550, lng: 85.8180 },
    { block: 'Cuttack Ward 1', cri: 55, color: 'orange', lat: 20.4625, lng: 85.8828 },
    { block: 'Chauliaganj', cri: 85, color: 'red', lat: 20.4500, lng: 85.9000 },
];

function SetView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function CRIMap() {
    // State for Hierarchy
    const [locations, setLocations] = useState<Record<string, any>>({});
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

    // Core State
    const [state, setState] = useState('Odisha');
    const [district, setDistrict] = useState('Khordha');
    const [selectedBlock, setSelectedBlock] = useState<string>(''); // NEW: Block filter
    const [mapData, setMapData] = useState<CRIData[]>(NATIONAL_OVERVIEW);
    const [fullMapData, setFullMapData] = useState<CRIData[]>(NATIONAL_OVERVIEW); // Store full data
    const [center, setCenter] = useState<[number, number]>([20.2961, 85.8245]);
    const [zoom, setZoom] = useState(12);
    const [loading, setLoading] = useState(false);

    // Auto-refresh State
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    // Fetch Locations on Mount
    useEffect(() => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        fetch(`${apiBaseUrl}/api/locations`)
            .then(res => res.json())
            .then(data => {
                setLocations(data);
                // Pre-select Odisha if available
                if (data['Odisha']) {
                    setState('Odisha');
                }
            })
            .catch(err => console.error("Failed to load locations:", err));
    }, []);

    // Update Districts when State Changes
    useEffect(() => {
        if (state && locations[state]) {
            const districtData = locations[state];
            if (Array.isArray(districtData)) {
                setAvailableDistricts(districtData);
            } else {
                setAvailableDistricts(Object.keys(districtData).sort());
            }
        } else {
            setAvailableDistricts([]);
        }
    }, [state, locations]);

    // Auto-refresh Effect
    useEffect(() => {
        if (!autoRefresh || !district) return;

        const interval = setInterval(() => {
            handleLoadData(true); // Silent reload
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [autoRefresh, district]);

    // Filter map data when block is selected
    useEffect(() => {
        if (selectedBlock) {
            const filtered = fullMapData.filter(d => d.block === selectedBlock);
            setMapData(filtered);

            // Auto-zoom to selected block
            if (filtered.length > 0) {
                setCenter([filtered[0].lat, filtered[0].lng]);
                setZoom(15);
            }
        } else {
            setMapData(fullMapData);
        }
    }, [selectedBlock, fullMapData]);

    const handleLoadData = async (silent = false) => {
        if (!district) return;
        if (!silent) setLoading(true);

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        try {
            // Correct Endpoint: GET /api/get_cri_data/<district>
            const response = await fetch(`${apiBaseUrl}/api/get_cri_data/${district}`);
            if (response.ok) {
                const data = await response.json();
                setFullMapData(data);
                setLastUpdate(new Date());

                // If no block selected, show all data
                if (!selectedBlock) {
                    setMapData(data);
                    if (data.length > 0 && !silent) {
                        setCenter([data[0].lat, data[0].lng]);
                        setZoom(12);
                    }
                }
            } else {
                console.error("API Error:", response.status);
            }
        } catch (error) {
            console.error("Failed to load map data", error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter([latitude, longitude]);
                    setZoom(14);
                    // Optional: You could reverse geo-code here to auto-select district, 
                    // but for now we just center the view.
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not access your location.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    // Extract available blocks from current map data
    const availableBlocks = Array.from(new Set(fullMapData.map(d => d.block))).sort();

    return (
        <div className="h-full flex flex-col relative rounded-2xl overflow-hidden shadow-sm border border-neutral-200">
            {/* Header / Controls */}
            <div className="bg-white z-20 shadow-md p-4 flex flex-col gap-3 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">CRI Heatmap</h1>

                    {/* Auto-refresh Toggle */}
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="w-4 h-4 accent-[#111111]"
                            />
                            <span className="font-medium">Auto-refresh (30s)</span>
                        </label>
                        {lastUpdate && (
                            <span className="text-xs text-gray-500 ml-2">
                                Updated: {lastUpdate.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <button
                        onClick={handleMyLocation}
                        className="p-2 border border-neutral-300 rounded hover:bg-neutral-100 text-neutral-600"
                        title="Use My Location"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                    </button>

                    <select
                        value={state}
                        onChange={(e) => {
                            setState(e.target.value);
                            setDistrict('');
                            setSelectedBlock('');
                        }}
                        className="border border-neutral-300 p-2 rounded w-32 text-sm"
                    >
                        {Object.keys(locations).length > 0 ? (
                            Object.keys(locations).sort().map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))
                        ) : (
                            <option>Loading...</option>
                        )}
                    </select>

                    <select
                        value={district}
                        onChange={(e) => {
                            setDistrict(e.target.value);
                            setSelectedBlock('');
                        }}
                        className="border border-neutral-300 p-2 rounded w-40 text-sm"
                    >
                        <option value="">Select District</option>
                        {availableDistricts.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>

                    <select
                        value={selectedBlock}
                        onChange={(e) => setSelectedBlock(e.target.value)}
                        className="border border-neutral-300 p-2 rounded w-48 text-sm"
                        disabled={availableBlocks.length === 0}
                    >
                        <option value="">All Blocks/Wards</option>
                        {availableBlocks.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => handleLoadData(false)}
                        disabled={loading}
                        className="bg-[#111111] text-white px-6 py-2 rounded text-sm font-bold hover:bg-black transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Load Data'}
                    </button>

                    {selectedBlock && (
                        <button
                            onClick={() => {
                                setSelectedBlock('');
                                setZoom(12);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2 border border-gray-300 rounded"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative z-10">
                <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                    <SetView center={center} zoom={zoom} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    {mapData.map((data, idx) => {
                        const isSelected = selectedBlock === data.block;
                        return (
                            <CircleMarker
                                key={idx}
                                center={[data.lat, data.lng]}
                                radius={isSelected ? 25 : 20}
                                pathOptions={{
                                    color: data.color === 'red' ? '#DC2626' : data.color === 'orange' ? '#F59E0B' : '#16A34A',
                                    fillColor: data.color === 'red' ? '#DC2626' : data.color === 'orange' ? '#F59E0B' : '#16A34A',
                                    fillOpacity: isSelected ? 0.8 : 0.6,
                                    weight: isSelected ? 3 : 2
                                }}
                            >
                                <Popup>
                                    <div className="p-2 text-center">
                                        <h3 className="font-bold text-lg">{data.block}</h3>
                                        <p className="text-sm text-gray-600">CRI Score: <span className="font-bold">{data.cri}</span></p>
                                        <p className="text-xs uppercase mt-1 font-semibold" style={{ color: data.color }}>{data.color === 'red' ? 'Critical Risk' : 'Elevated'} Zone</p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                    })}
                </MapContainer>

                {/* Legend */}
                <div className="absolute bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg z-[400] border border-gray-200">
                    <h4 className="text-xs font-bold uppercase mb-2 text-gray-500">Risk Intensity</h4>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-[#DC2626]"></span> <span className="text-xs font-medium">Critical (80+)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span> <span className="text-xs font-medium">Elevated (50-79)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#16A34A]"></span> <span className="text-xs font-medium">Safe (0-49)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
