"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
}

export function NavBar({ items, className }: NavBarProps) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(items[0].name)
    // const [isMobile, setIsMobile] = useState(false)

    // Auto-set active tab based on URL or Scroll
    useEffect(() => {
        const isHashNav = items.some(i => i.url.startsWith('#'));

        if (isHashNav) {
            const handleScroll = () => {
                const scrollPosition = window.scrollY + 300;

                const targets = items
                    .filter(item => item.url.startsWith('#'))
                    .map(item => {
                        const element = document.getElementById(item.url.substring(1));
                        return {
                            name: item.name,
                            offset: element ? element.offsetTop : 0,
                            element
                        };
                    })
                    .filter(target => target.element)
                    .sort((a, b) => a.offset - b.offset);

                let currentSection = items[0].name;
                for (const target of targets) {
                    if (target.offset <= scrollPosition) {
                        currentSection = target.name;
                    }
                }
                setActiveTab(currentSection);
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            const currentItem = items.find(item => item.url === location.pathname);
            if (currentItem) {
                setActiveTab(currentItem.name);
            }
        }
    }, [location, items]);

    /*
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    */

    return (
        <div
            className={cn(
                "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
                className,
            )}
        >
            <div className="flex items-center gap-3 bg-neutral-900/5 border border-neutral-200/20 backdrop-blur-lg py-2 px-2 rounded-full shadow-lg dark:bg-neutral-100/5 dark:border-neutral-800/20">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <Link
                            key={item.name}
                            to={item.url}
                            onClick={(e) => {
                                setActiveTab(item.name);
                                if (item.url.startsWith('#')) {
                                    e.preventDefault();
                                    const el = document.querySelector(item.url);
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className={cn(
                                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors whitespace-nowrap",
                                "text-neutral-600 hover:text-[#0B0D12] dark:text-neutral-400 dark:hover:text-neutral-100",
                                isActive && "bg-white text-black shadow-sm dark:bg-white dark:text-black",
                            )}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={20} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full bg-[#F97316]/5 rounded-full -z-10"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 20,
                                        mass: 1
                                    }}
                                >
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-[#F97316] rounded-t-full">
                                        <div className="absolute w-16 h-8 bg-[#F97316]/20 rounded-full blur-md -top-2 -left-3" />
                                        <div className="absolute w-10 h-8 bg-[#F97316]/20 rounded-full blur-md -top-1" />
                                        <div className="absolute w-5 h-5 bg-[#F97316]/20 rounded-full blur-sm top-0 left-2" />
                                    </div>
                                </motion.div>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
