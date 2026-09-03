// Original mark, drawn from scratch for this brand — no template, no
// stock icon, nothing traced from another logo. A gateway arch over a
// ground line: reads as "access" for the concierge desk and as
// "institutional architecture" for the government-liaison side of the
// business. Works from a 320px header badge down to a 16px favicon.
export default function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="HR — The Mediator"
    >
      <circle cx="24" cy="24" r="24" fill="#17241C" />
      <path
        d="M13 33 V19.5 A11 11 0 0 1 35 19.5 V33"
        fill="none"
        stroke="#A6402A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M9 33.5 H39" stroke="#D9A441" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
