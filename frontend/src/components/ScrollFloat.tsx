import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
    children: ReactNode;
    scrollContainerRef?: RefObject<HTMLElement>;
    containerClassName?: string;
    textClassName?: string;
    animationDuration?: number;
    ease?: string;
    scrollStart?: string;
    scrollEnd?: string;
    stagger?: number;
    as?: React.ElementType;
}

const ScrollFloat = ({
    children,
    scrollContainerRef,
    containerClassName = '',
    textClassName = '',
    animationDuration = 1,
    ease = 'back.inOut(2)',
    scrollStart = 'center bottom+=50%',
    scrollEnd = 'bottom bottom-=40%',
    stagger = 0.03,
    as: Tag = 'h2'
}: ScrollFloatProps) => {
    const containerRef = useRef<HTMLElement>(null);

    const splitText = useMemo(() => {
        const text = typeof children === 'string' ? children : '';
        return text.split('').map((char, index) => {
            if (char === ' ') {
                return <span key={index}> </span>;
            }
            return (
                <span className="inline-block" key={index}>
                    {char}
                </span>
            );
        });
    }, [children]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

        const charElements = el.querySelectorAll('.inline-block');

        gsap.fromTo(
            charElements,
            {
                willChange: 'opacity, transform',
                opacity: 0,
                yPercent: 120,
                scaleY: 2.3,
                scaleX: 0.7,
                transformOrigin: '50% 0%'
            },
            {
                duration: animationDuration,
                ease: ease,
                opacity: 1,
                yPercent: 0,
                scaleY: 1,
                scaleX: 1,
                stagger: stagger,
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: scrollStart,
                    end: scrollEnd,
                    scrub: true
                }
            }
        );

        return () => {
            // Cleanup if needed, though gsap handles scrolltrigger cleanup mostly. 
            // Ideally we kill the scrolltrigger associated with this element.
            // But the user code didn't have specific cleanup. We'll leave it for now or add simple kill.
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === el) t.kill();
            });
        }
    }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

    return (
        <Tag ref={containerRef} className={`my-5 overflow-hidden ${containerClassName}`}>
            <span className={`inline-block leading-[1.5] ${textClassName}`}>{splitText}</span>
        </Tag>
    );
};

export default ScrollFloat;
