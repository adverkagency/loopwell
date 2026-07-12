/** Rounded-outline icon set (1.8px stroke, currentColor) — ported from the prototype sprite. */

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2.2}>
    <polyline points="4,12.5 9,17.5 20,6.5" />
  </svg>
);

export const XIcon = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2.2}>
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

export const HalfIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none" />
  </svg>
);

export const FlameIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 1.5 2.5 1.5 4a4.5 4.5 0 0 1-9 0C7.5 9 9 6 12 2z" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2.2}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const DumbbellIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="1.5" y="9" width="3" height="6" rx="1" />
    <rect x="19.5" y="9" width="3" height="6" rx="1" />
    <path d="M6 12h12" />
    <rect x="5" y="10" width="2.2" height="4" rx="0.6" />
    <rect x="16.8" y="10" width="2.2" height="4" rx="0.6" />
  </svg>
);

export const DropletIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3c4 5 7 8.5 7 12a7 7 0 0 1-14 0c0-3.5 3-7 7-12z" />
  </svg>
);

export const BookIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" />
    <path d="M4 5.5V19" />
  </svg>
);

export const LotusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21c-4-1-6-4-6-8 2 1 4 3 6 6 2-3 4-5 6-6 0 4-2 7-6 8z" />
    <circle cx="12" cy="9" r="2.2" />
  </svg>
);

export const MoonIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
  </svg>
);

export const LeafIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 19c8 1 14-5 14-14-9 0-14 6-14 14z" />
    <path d="M5 19c3-4 6-7 9-10" />
  </svg>
);

export const WalkIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="13.5" cy="4.2" r="1.6" fill="currentColor" stroke="none" />
    <path d="M13 7l-1.5 4 3 2.2-.5 6.3M11.5 11l-3.5 2 1 5M8.5 12.5l-3 1.3" />
  </svg>
);

export const EditIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8L17.3 5.5a2 2 0 0 0-2.8 0L4 16z" />
    <path d="M13.5 6.5l4 4" />
  </svg>
);

export const PillIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="9.5" width="16" height="5" rx="2.5" transform="rotate(-35 12 12)" />
    <line x1="12" y1="6.5" x2="12" y2="17.5" transform="rotate(-35 12 12)" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2}>
    <polyline points="7,10 12,15 17,10" />
  </svg>
);

/** name → component map for template-driven rendering */
export const ICONS = {
  check: CheckIcon,
  x: XIcon,
  half: HalfIcon,
  flame: FlameIcon,
  plus: PlusIcon,
  dumbbell: DumbbellIcon,
  droplet: DropletIcon,
  book: BookIcon,
  lotus: LotusIcon,
  moon: MoonIcon,
  leaf: LeafIcon,
  walk: WalkIcon,
  edit: EditIcon,
  pill: PillIcon,
  chevron: ChevronDownIcon,
} as const;

export type IconName = keyof typeof ICONS;

export function HabitIcon({ name, size = 20, className }: { name: string | null; size?: number; className?: string }) {
  const Cmp = (name && name in ICONS ? ICONS[name as IconName] : LeafIcon);
  return <Cmp size={size} className={className} />;
}
