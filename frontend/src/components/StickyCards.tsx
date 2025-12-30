import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface StickyCardProps {
    i: number;
    title: string;
    description: string;
    meta: string;
    level: string;
    color: string;
    progress: MotionValue<number>;
    range: [number, number];
    targetScale: number;
}

const Card = ({ i, title, description, meta, level, color, progress, range, targetScale }: StickyCardProps) => {
    const container = useRef(null);



    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{
                    scale,
                    backgroundColor: 'var(--bg-card)', // Changed from 'white' to variable
                    top: `calc(-10% + ${i * 25}px)`
                }}
                className="flex flex-col relative h-[500px] w-[900px] rounded-2xl p-10 origin-top shadow-xl border border-neutral-200 transition-colors duration-300"
            >
                {/* Header / Tab */}
                <div className="flex justify-between items-center border-b border-neutral-100 pb-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                        <h2 className="text-sm font-mono uppercase tracking-widest text-neutral-400">{meta}</h2>
                    </div>
                    <div className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-neutral-50 text-neutral-500 border border-neutral-100">
                        Case File #{i + 1}
                    </div>
                </div>

                {/* Content */}
                <div className="flex h-full gap-8 relative">
                    <div className="w-[60%] flex flex-col pt-2">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-100 text-neutral-500 border border-neutral-200">
                                Incident Report
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-100 text-neutral-500 border border-neutral-200">
                                Ver: 1.0
                            </span>
                        </div>

                        <h3 className="text-4xl md:text-5xl font-bold mb-4 leading-none tracking-tight text-neutral-800 font-sans">
                            {title}
                        </h3>

                        <div className="h-px w-full bg-neutral-100 mb-6"></div>

                        <p className="text-lg text-neutral-600 leading-relaxed font-light mb-auto">
                            {description}
                        </p>

                        <div className="flex items-center gap-4 mt-8 pt-4 border-t border-dotted border-neutral-300">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-neutral-400 font-mono">Status</span>
                                <span className="text-sm font-medium text-neutral-700">Open investigation</span>
                            </div>
                            <div className="h-8 w-px bg-neutral-200"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-neutral-400 font-mono">Assigned</span>
                                <span className="text-sm font-medium text-neutral-700">Automated System</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-[40%] bg-neutral-50 rounded-xl p-6 flex flex-col justify-between border border-neutral-100 relative overflow-hidden group">
                        {/* Abstract Graphic - Scanline */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #000 25%, #000 26%, transparent 27%, transparent 74%, #000 75%, #000 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #000 25%, #000 26%, transparent 27%, transparent 74%, #000 75%, #000 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}>
                        </div>
                        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-110" style={{ backgroundColor: color }}></div>

                        <div className="relative z-10">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Risk Severity</p>
                            {/* Reduced text size to ensure fit */}
                            <p className="text-xl md:text-2xl font-mono font-bold leading-none break-all" style={{ color: color }}>{level.toUpperCase()}</p>
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-400">Escalation</p>
                                <p className="text-[10px] font-mono text-neutral-400">{i * 25}%</p>
                            </div>
                            <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-neutral-200">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(i + 1) * 25}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full"
                                    style={{ backgroundColor: color }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

interface StickyCardsProps {
    items: {
        title: string;
        description: string;
        meta: string;
        level: string;
        color: string;
    }[];
}

export default function StickyCards({ items }: StickyCardsProps) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    return (
        <div ref={container} className="relative mt-20 z-10">
            {items.map((item, i) => {
                const targetScale = 1 - ((items.length - i) * 0.05);
                return (
                    <Card
                        key={i}
                        i={i}
                        {...item}
                        progress={scrollYProgress}
                        range={[i * 0.25, 1]}
                        targetScale={targetScale}
                    />
                );
            })}
        </div>
    );
}
