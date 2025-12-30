import { motion } from 'framer-motion';
import { MapPin, Clock, Eye, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BentoCardProps {
    title: string;
    desc: string;
    icon: LucideIcon;
    className?: string;
    delay?: number;
}

const BentoCard = ({ title, desc, icon: Icon, className = '', delay = 0 }: BentoCardProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className={`bg-neutral-100 p-8 rounded-2xl border border-neutral-200 flex flex-col justify-between group overflow-hidden relative ${className}`}
    >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <Icon className="w-6 h-6 text-neutral-600 group-hover:text-red-600 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-3">{title}</h3>
            <p className="text-neutral-500 leading-relaxed font-light">{desc}</p>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -bottom-4 -right-4 text-neutral-100 opacity-50">
            <Icon className="w-32 h-32 rotate-12" />
        </div>
    </motion.div>
);

export default function IntegrityGrid() {
    return (
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Main Feature - Spans 2 cols */}
            <BentoCard
                className="md:col-span-2"
                title="Geo-Tag Verification"
                desc="Every report is cryptographically anchored to a physical location. Spoofing is mathematically impossible."
                icon={MapPin}
                delay={0.1}
            />

            {/* Secondary - 1 col */}
            <BentoCard
                title="Time Escalation"
                desc="Risk scores compound automatically every 24 hours of inaction."
                icon={Clock}
                delay={0.2}
            />

            {/* Secondary - 1 col */}
            <BentoCard
                title="Public Visibility"
                desc="Data flows directly to public dashboards. Transparency is the default."
                icon={Eye}
                delay={0.3}
            />

            {/* Main Feature - Spans 2 cols */}
            <BentoCard
                className="md:col-span-2"
                title="Authority Acknowledgment"
                desc="Official responses are tracked and time-stamped. Silence is recorded as a decision."
                icon={Shield}
                delay={0.4}
            />
        </div>
    );
}
