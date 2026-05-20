interface IconProps {
    className?: string
    size?: number
}

export const HomeIcon = ({ className, size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
        <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" fill="currentColor" opacity={0.9} />
        <rect x="7" y="11" width="6" height="7" rx="1" fill="currentColor" opacity={0.5} />
    </svg>
)

export const SalesIcon = ({ className, size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
        <rect x="2" y="10" width="4" height="8" rx="1" fill="currentColor" opacity={0.7} />
        <rect x="8" y="6" width="4" height="12" rx="1" fill="currentColor" />
        <rect x="14" y="2" width="4" height="16" rx="1" fill="currentColor" opacity={0.7} />
    </svg>
)

export const InventoryIcon = ({ className, size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
        <rect x="2" y="8" width="16" height="10" rx="1.5" fill="currentColor" opacity={0.7} />
        <path d="M6 8V5a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
)

export const ChevronIcon = ({ className, size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
        <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export const BellIcon = ({ className, size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
        <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" fill="currentColor" opacity={0.85} />
        <path d="M8 16a2 2 0 004 0" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
)

export const LogoutIcon = ({ className, size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
        <path d="M13 4h3a1 1 0 011 1v10a1 1 0 01-1 1h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 7l3 3-3 3M12 10H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export const SearchIcon = ({ className, size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
        <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
)

export const ConfigIcon = ({ className, size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
)

export const MedvalLogo = ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="#1a2a5e" />
        <path d="M6 22l5-10 4 7 3-5 4 8 5-12" stroke="#e96c2a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="18" cy="13" r="3" fill="#fff" opacity={0.15} />
    </svg>
)
