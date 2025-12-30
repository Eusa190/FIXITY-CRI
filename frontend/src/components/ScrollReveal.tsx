import { useEffect, useRef, useMemo, type ReactNode, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
    children: ReactNode;
    scrollContainerRef?: RefObject<HTMLElement>;
    enableBlur?: boolean;
    baseOpacity?: number;
    baseRotation?: number;
    blurStrength?: number;
    containerClassName?: string;
    textClassName?: string;
    rotationEnd?: string;
    wordAnimationEnd?: string;
    as?: React.ElementType;
}

const ScrollReveal = ({
    children,
    scrollContainerRef,
    enableBlur = true,
    baseOpacity = 0.1,
    baseRotation = 3,
    blurStrength = 4,
    containerClassName = '',
    textClassName = '',
    rotationEnd = 'bottom bottom',
    wordAnimationEnd = 'bottom bottom',
    as: Tag = 'h2'
}: ScrollRevealProps) => {
    const containerRef = useRef<HTMLElement>(null);

    const splitText = useMemo(() => {
        const text = typeof children === 'string' ? children : '';
        return text.split(/(\s+)/).map((word, index) => {
            if (word.match(/^\s+$/)) return word;
            return (
                <span className="inline-block word" key={index}>
                    {word}
                </span>
            );
        });
    }, [children]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

        gsap.fromTo(
            el,
            { transformOrigin: '0% 50%', rotate: baseRotation },
            {
                ease: 'none',
                rotate: 0,
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: 'top bottom',
                    end: rotationEnd,
                    scrub: true
                }
            }
        );

        const wordElements = el.querySelectorAll('.word');

        gsap.fromTo(
            wordElements,
            { opacity: baseOpacity, willChange: 'opacity' },
            {
                ease: 'none',
                opacity: 1,
                stagger: 0.05,
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: 'top bottom-=20%',
                    end: wordAnimationEnd,
                    scrub: true
                }
            }
        );

        if (enableBlur) {
            gsap.fromTo(
                wordElements,
                { filter: `blur(${blurStrength}px)` },
                {
                    ease: 'none',
                    filter: 'blur(0px)',
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom-=20%',
                        end: wordAnimationEnd,
                        scrub: true
                    }
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === el) trigger.kill();
            });
        };
    }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

    return (
        <Tag ref={containerRef} className={`my-5 ${containerClassName}`}>
            <span className={`block leading-[1.5] font-semibold ${textClassName}`}>{splitText}</span>
        </Tag>
    );
};

export default ScrollReveal;
