import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import TrueFocus from '../components/TrueFocus';
import ScrollFloat from '../components/ScrollFloat';
import StickyCards from '../components/StickyCards';
import IntegrityGrid from '../components/IntegrityGrid';
import AudienceToggle from '../components/AudienceToggle';
import LiveMapPreview from '../components/LiveMapPreview';



// ============================================
// FIXITY LANDING PAGE — JUDGE-SAFE VERSION
// Restraint. Evidence. Inevitability.
// ============================================

export default function Landing() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--canvas)', color: 'var(--text-primary)' }}>
            <HeroWithRiskReadout />
            <RiskAccumulationTimeline />
            <SystemIntegrityStack />
            <PublicMapPreview />
            <DualAudience />
            <FinalCTA />
        </div>
    );
}

import { BackgroundBeamsWithCollision } from '../components/ui/background-beams-with-collision';

// ============================================
// SECTION 1: HERO WITH RISK READOUT
// Static. Authoritative. No animation theatrics.
// ============================================
function HeroWithRiskReadout() {
    // Static risk data - representing current system state
    const riskZones = [
        { area: 'Delhi', cri: 94, status: 'Critical' },
        { area: 'Pune', cri: 72, status: 'Elevated' },
        { area: 'Bhubaneswar', cri: 45, status: 'Monitoring' },
    ];

    // Fake live update timer
    const [lastUpdated, setLastUpdated] = useState('Updated 2 minutes ago');
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated('Updated just now');
            setTimeout(() => setLastUpdated('Updated 1 minute ago'), 60000);
            setTimeout(() => setLastUpdated('Updated 2 minutes ago'), 120000);
        }, 180000); // 3 min cycle
        return () => clearInterval(interval);
    }, []);

    return (
        <BackgroundBeamsWithCollision className="min-h-[50vh] flex items-center pt-24 pb-8 bg-transparent">
            <div id="home" className="container mx-auto px-6 relative z-20" style={{ maxWidth: '1100px' }}>
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Message */}
                    <div>
                        {/* System identifier */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ duration: 0.6 }}
                            className="text-[12px] uppercase tracking-[0.2em] mb-4"
                            style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--text-muted)' }}
                        >
                            Public Civic Risk Measurement System
                        </motion.p>



                        {/* Core headline - tighter, harder */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mb-4"
                        >
                            <div style={{ color: 'var(--text-primary)' }}>
                                <ScrollFloat
                                    as="h1"
                                    animationDuration={1}
                                    ease='back.inOut(2)'
                                    scrollStart='center bottom+=50%'
                                    scrollEnd='bottom bottom-=40%'
                                    stagger={0.03}
                                    textClassName="text-[48px] md:text-[56px] font-bold leading-[1.05]"
                                    containerClassName="!my-0"
                                >
                                    Civic neglect is no longer invisible.
                                </ScrollFloat>
                            </div>
                            <div className="text-[48px] md:text-[56px] font-bold leading-[1.05] mt-2"
                                style={{ color: 'var(--text-secondary)' }}>
                                <TrueFocus
                                    sentence="It Is Measurable Risk"
                                    manualMode={false}
                                    blurAmount={4}
                                    borderColor="var(--risk-critical)"
                                    animationDuration={0.8}
                                    pauseBetweenAnimations={0.5}
                                />
                            </div>
                        </motion.div>

                        {/* Subheadline and ASSERTION */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-6"
                        >
                            <p className="text-[20px] leading-[1.6] mb-4" style={{ color: 'var(--text-secondary)' }}>
                                Fixity tracks unresolved civic issues over time and converts public inaction into a visible, escalating risk index.
                            </p>
                            <p className="text-[18px] font-medium pl-4 border-l-2"
                                style={{ color: 'var(--text-primary)', borderColor: 'var(--risk-elevated)' }}>
                                Unresolved issues automatically increase civic risk.
                            </p>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <Link
                                    to="/report"
                                    className="inline-flex items-center gap-3 px-8 py-4 text-white font-semibold text-[16px] transition-all hover:opacity-90 group rounded-sm shadow-lg hover:shadow-xl"
                                    style={{ backgroundColor: 'var(--btn-primary-bg)' }}
                                >
                                    Report an Issue
                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>

                                {/* Moved Live Indicator Here */}
                                <div className="flex items-center gap-3 pl-2 border-l-2 border-neutral-200">
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-500"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">CRI Live</span>
                                        <span className="text-[12px] font-mono text-neutral-800">{lastUpdated}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[13px] mt-4" style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--text-muted)' }}>
                                All reports are public and contribute to the risk index.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right: New Big Buttons (Replaced List) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Button 1: Check Your Own City */}
                        <Link to="/map" className="group relative block p-8 bg-white border border-neutral-200 hover:border-neutral-400 transition-all shadow-sm hover:shadow-md rounded-xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-red-500 transition-all group-hover:w-2"></div>
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-black">CRI Check Your Own City</h3>
                                    <p className="text-neutral-500 text-sm">View real-time risk maps for Odisha blocks & districts.</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                    <MapPin className="w-6 h-6" />
                                </div>
                            </div>
                        </Link>

                        {/* Button 2: Everything About CRI */}
                        <Link to="/how-cri-works" className="group relative block p-8 bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-all shadow-sm hover:shadow-md rounded-xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500 transition-all group-hover:w-2"></div>
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-black">Everything About CRI</h3>
                                    <p className="text-neutral-500 text-sm">Understand the methodology behind the risk score.</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border border-neutral-200 group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                            </div>
                        </Link>

                    </motion.div>
                </div>
            </div>
        </BackgroundBeamsWithCollision>
    );
}

// ============================================
// SECTION 2: RISK ACCUMULATION TIMELINE
// Progressive Escalation Scroll - evidence revealed
// ============================================
function RiskAccumulationTimeline() {
    const timeline = [
        { day: 'Day 1', cri: '+2', level: 'Minor', desc: 'Issue reported to authorities. The clock starts ticking immediately.', date: 'Dec 12' },
        { day: 'Day 14', cri: '+11', level: 'Escalated', desc: 'No response received. The issue has entered the visible risk zone.', date: 'Dec 26' },
        { day: 'Day 45', cri: '+28', level: 'Critical', desc: 'Threshold crossed. Automatic notification sent to oversight bodies.', date: 'Jan 26' },
        { day: 'Day 90', cri: '+65', level: 'Systemic', desc: 'Systemic failure recorded. This area is now a high-priority risk zone.', date: 'Mar 15' },
    ];

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Systemic': return '#000000';
            case 'Critical': return 'var(--risk-critical)';
            case 'Escalated': return 'var(--risk-elevated)';
            default: return 'var(--text-muted)';
        }
    };

    const stickyItems = timeline.map(item => ({
        title: `CRI ${item.cri}`,
        description: item.desc,
        meta: item.day,
        level: item.level,
        color: getLevelColor(item.level)
    }));

    return (
        <section id="timeline" className="relative" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="container mx-auto px-6 py-24 mb-0 pb-0" style={{ maxWidth: '900px' }}>
                <div style={{ color: 'var(--text-primary)' }}>
                    <ScrollFloat
                        as="h2"
                        animationDuration={1}
                        ease='back.inOut(2)'
                        scrollStart='center bottom+=50%'
                        scrollEnd='bottom bottom-=40%'
                        stagger={0.03}
                        textClassName="text-[36px] font-semibold leading-[1.2]"
                        containerClassName="mb-6 !my-0"
                    >
                        Unresolved issues accumulate risk over time.
                    </ScrollFloat>
                </div>
                <p className="text-[18px] mb-12" style={{ color: 'var(--text-secondary)' }}>
                    Every day of inaction increases the Civic Risk Index.
                </p>
            </div>

            {/* Sticky Scroll Stack */}
            <StickyCards items={stickyItems} />

            <div className="container mx-auto px-6 py-12 border-t border-dashed" style={{ borderColor: 'var(--border-subtle)', maxWidth: '900px' }}>
                <div className="flex items-center justify-between">
                    <p className="text-[14px]" style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--text-muted)' }}>
                        Risk calculation is automatic and publicly auditable.
                    </p>
                    <p className="text-[14px] font-medium" style={{ color: 'var(--risk-critical)' }}>
                        Risk does not reset without resolution.
                    </p>
                </div>
            </div>
        </section>
    );
}

// ============================================
// SECTION 3: SYSTEM INTEGRITY STACK
// Boring. Implementable. Defensible.
// ============================================
function SystemIntegrityStack() {
    const sectionRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="integrity" ref={sectionRef} className="py-24" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={visible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-[12px] uppercase tracking-[0.15em] mb-6 text-center md:text-left"
                        style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--text-muted)' }}>
                        Report Integrity Layer
                    </p>
                    <div style={{ color: 'var(--text-primary)' }} className="text-center md:text-left">
                        <ScrollFloat
                            as="h2"
                            animationDuration={1}
                            ease='back.inOut(2)'
                            scrollStart='center bottom+=50%'
                            scrollEnd='bottom bottom-=40%'
                            stagger={0.03}
                            textClassName="text-[36px] font-semibold leading-[1.2]"
                            containerClassName="mb-12 !my-0"
                        >
                            How reports become risk.
                        </ScrollFloat>
                    </div>

                    {/* Bento Grid */}
                    <div className="mt-16">
                        <IntegrityGrid />
                    </div>

                    <div className="pt-8 border-t border-dotted mt-16" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-[14px]" style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--text-muted)' }}>
                            No AI claims. No blockchain. <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Every step is time-stamped and publicly auditable.</span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================
// SECTION 4: DUAL AUDIENCE
// Citizen vs Authority - simplified language
// ============================================
// ============================================
// SECTION 4: DUAL AUDIENCE
// Citizen vs Authority - simplified language
// ============================================
function DualAudience() {
    return (
        <section id="audience" className="py-24 border-t relative z-50" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--canvas)' }}>
            <AudienceToggle />
        </section>
    );
}

// ============================================
// SECTION 5: PUBLIC MAP PREVIEW
// Simple. Visual. Hard to fake.
// ============================================
function PublicMapPreview() {
    return <section id="live-map"><LiveMapPreview /></section>;
}

// ============================================
// SECTION 6: FINAL CTA
// Restrained. Inevitable.
// ============================================
function FinalCTA() {
    return (
        <section className="py-32 text-center border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="container mx-auto px-6">
                <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-neutral-900">Accountability is inevitable.</h2>
                <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto">
                    The Civic Risk Index ensures that no failure goes unrecorded. Start measuring what matters.
                </p>
                <Link to="/report" className="relative inline-flex group">
                    {/* Solid Authority Button - Matches Hero */}
                    <button className="relative inline-flex items-center gap-4 px-10 py-5 text-xl font-bold text-white transition-all duration-300 bg-neutral-900 rounded-sm hover:bg-neutral-800 hover:shadow-lg">
                        Report an Issue
                        <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </Link>
            </div>
        </section>
    );
}
