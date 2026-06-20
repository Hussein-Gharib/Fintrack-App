function LogoIcon() {
  return (
    <div className="fintrack-logo-icon" aria-label="FinTrack logo">
      <svg
        viewBox="0 0 64 64"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="8" y1="56" x2="56" y2="8">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        <rect width="64" height="64" rx="18" fill="#0f172a" />

        <path
          d="M18 44V20h28"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M18 32h22"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        <path
          d="M20 45l10-10 8 7 13-17"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M50 25v10h-10"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default LogoIcon;