/**
 * Stylized Snoo-inspired app logo with gradient background.
 */
export default function RedditLogo({ className = "" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF4500" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="39" height="39" rx="12" fill="url(#logo-grad)" />
      {/* antenna */}
      <path
        d="M20 14.5V9"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="7.2" r="2.2" fill="#ffffff" />
      {/* head */}
      <circle cx="20" cy="22" r="7.5" fill="#ffffff" />
      {/* eyes */}
      <circle cx="17" cy="21.4" r="1.5" fill="#FF4500" />
      <circle cx="23" cy="21.4" r="1.5" fill="#FF4500" />
      {/* smile */}
      <path
        d="M17.6 25c.8.8 1.6 1.2 2.4 1.2s1.6-.4 2.4-1.2"
        stroke="#FF4500"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
