import { useRef, useLayoutEffect } from 'react'

interface amountCardProps {
    titlle: string,
    value: string,
    value2?: string,
}

function ShrinkText({ children, className }: { children: string; className?: string }) {
    const ref = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const parent = el.parentElement;
        if (!parent) return;

        const fit = () => {
            if (parent.clientWidth === 0) return;
            el.style.fontSize = '';
            if (el.scrollWidth > parent.clientWidth) {
                const ratio = parent.clientWidth / el.scrollWidth;
                const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
                if (ratio > 0 && currentSize > 0) {
                    const newSize = currentSize * ratio * 0.95;
                    if (newSize >= 10) {
                        el.style.fontSize = `${newSize.toFixed(1)}px`;
                    }
                }
            }
        };

        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(parent);
        return () => observer.disconnect();
    }, [children]);

    return (
        <p ref={ref} className={className}>
            {children}
        </p>
    );
}

export default function amountCard({ titlle, value, value2 = '' }: amountCardProps) {
    return (
        <div className="min-w-0">
            <p className="text-xs sm:text-sm text-slate-400 uppercase leading-tight break-words h-8 sm:h-auto">
                {titlle}
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-end sm:items-center justify-end gap-1 sm:gap-2">
                <ShrinkText className="font-display text-lg sm:text-xl lg:text-3xl font-bold text-brand-orange mt-2 leading-tight text-right">
                    {value}$
                </ShrinkText>
                {value2 === '' ? (<></>) : (
                    <ShrinkText className="font-display text-lg sm:text-xl lg:text-3xl font-semibold text-brand-navy-light mt-2 leading-tight text-right">
                        {value2}u
                    </ShrinkText>
                )}
            </div>
        </div >
    )
}
