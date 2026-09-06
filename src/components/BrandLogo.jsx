import React from "react";

export default function BrandLogo({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="24" fill="#2E7D32" />
      {/* basket */}
      <path
        d="M12 20h24l-2.4 12.5a3 3 0 0 1-2.95 2.5H17.35a3 3 0 0 1-2.95-2.5L12 20z"
        fill="#fff"
        opacity="0.95"
      />
      <path d="M16 20l1.5-5h13L32 20" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
      {/* handle */}
      <path
        d="M17 20c0-3.3 3.1-6 7-6s7 2.7 7 6"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* leaves */}
      <path
        d="M24 30c0-3 2-5 4.5-5.5 0 3-2 5-4.5 5.5z"
        fill="#A5D6A7"
      />
      <path
        d="M24 30c0-3-2-5-4.5-5.5 0 3 2 5 4.5 5.5z"
        fill="#81C784"
      />
      <path d="M24 30v-6" stroke="#2E7D32" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}