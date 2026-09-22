import  { useState, useRef, useEffect } from "react";

export function InfoTooltip() {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={tooltipRef}>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation(); 
                    setIsOpen(!isOpen);
                }}
                className="flex items-center justify-center p-1 rounded transition-colors cursor-pointer"
                style={{
                    color: "var(--color-text-muted)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-heading)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                aria-label="File format info"
            >
                <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                </svg>
            </button>

            {isOpen && (
                <div 
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 p-4 rounded-xl text-xs text-center z-50 select-text"
                    onClick={(e) => e.stopPropagation()} 
                    style={{
                        backgroundColor: "var(--color-bg-dropdown)",
                        border: "1px solid var(--color-border-subtle)",
                        boxShadow: "var(--shadow-dropdown)",
                        color: "var(--color-text-primary)"
                    }}
                >
                    <p className="font-semibold mb-1 text-sm" style={{ color: "var(--color-text-heading)" }}>
                        Expected format
                    </p>
                    <pre 
                        className="p-2.5 rounded-lg text-[11px] overflow-x-auto font-mono select-all cursor-text"
                        style={{
                            backgroundColor: "var(--color-bg-main)",
                            color: "var(--color-text-heading)",
                            border: "1px solid var(--color-border-subtle)"
                        }}
                        title="Click to select all"
                    >
                        {`{"timestamp":"2026-09-14T01:13:24Z","method":"GET","path":"/orders","status":200,"duration":183}`}
                    </pre>
                </div>
            )}
        </div>
    );
}