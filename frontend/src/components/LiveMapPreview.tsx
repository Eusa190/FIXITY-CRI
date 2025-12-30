import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LiveMapPreview() {
    return (
        <section className="py-24 border-t border-neutral-200">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex flex-col items-center text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Live Civic Risk Heatmap</h2>
                    <p className="text-neutral-600">Real-time data from across the city. Verified and visualized.</p>
                </div>

                <Link to="/map" className="block relative w-full aspect-[16/9] bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 group shadow-2xl">
                    {/* Dark Map Base */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}>
                    </div>

                    {/* Animated Pings */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="absolute" style={{ top: `${30 + (i * 15) % 50}%`, left: `${20 + (i * 20) % 60}%` }}>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" style={{ animationDuration: `${2 + i * 0.5}s` }}></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        </div>
                    ))}

                    {/* Scanning Line */}
                    <motion.div
                        className="absolute h-full w-px bg-gradient-to-b from-transparent via-green-500/50 to-transparent box-shadow-[0_0_15px_rgba(0,255,0,0.5)]"
                        animate={{ left: ['0%', '100%'] }}
                        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                        style={{ boxShadow: '0 0 10px #22c55e' }}
                    />

                    {/* Overlay UI */}
                    <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-mono text-neutral-300 uppercase tracking-wider">System Online • Monitoring</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <span className="px-6 py-3 bg-white text-black font-bold rounded-full transform scale-95 group-hover:scale-100 transition-transform">
                            Explore Interactive Map
                        </span>
                    </div>
                </Link>
            </div>
        </section>
    );
}
