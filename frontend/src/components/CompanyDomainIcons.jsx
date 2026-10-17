import React from 'react';

// ── Company Vector Logos ──────────────────────────────────────────────────────

// TCS (Tata Consultancy Services)
export const TCSLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 110 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(4, 2)">
      {/* Dynamic Ribbon Waves */}
      <path
        d="M2 14C5 8 10 4 16 4C23 4 27 10 30 16C33 22 37 26 44 26C51 26 55 21 57 16"
        stroke="url(#tcsGradient1)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M12 24C16 26 21 26 25 24C31 20 34 12 40 8C44 5 48 5 53 7"
        stroke="url(#tcsGradient2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Stylized "tcs" text */}
      <text
        x="60"
        y="21"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="#111827"
        letterSpacing="-0.5px"
      >
        tcs
      </text>
    </g>
    <defs>
      <linearGradient id="tcsGradient1" x1="2" y1="4" x2="57" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E31837" />
        <stop offset="0.45" stopColor="#A8287C" />
        <stop offset="1" stopColor="#0066B2" />
      </linearGradient>
      <linearGradient id="tcsGradient2" x1="12" y1="26" x2="53" y2="5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F99F1B" />
        <stop offset="0.5" stopColor="#E31837" />
        <stop offset="1" stopColor="#0099FF" />
      </linearGradient>
    </defs>
  </svg>
);

// Wipro
export const WiproLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 110 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(4, 3)">
      {/* Multi-color Flower Sunburst dots */}
      <circle cx="13" cy="7" r="2.2" fill="#0072CE" />
      <circle cx="18" cy="8.5" r="2.2" fill="#00B5E2" />
      <circle cx="21" cy="12.5" r="2.2" fill="#78BE20" />
      <circle cx="21" cy="17.5" r="2.2" fill="#FFD100" />
      <circle cx="18" cy="21.5" r="2.2" fill="#FF8200" />
      <circle cx="13" cy="23" r="2.2" fill="#E4002B" />
      <circle cx="8" cy="21.5" r="2.2" fill="#D0006F" />
      <circle cx="5" cy="17.5" r="2.2" fill="#7F226B" />
      <circle cx="5" cy="12.5" r="2.2" fill="#002D72" />
      <circle cx="8" cy="8.5" r="2.2" fill="#005B94" />
      {/* Inner dots */}
      <circle cx="11" cy="12" r="1.6" fill="#78BE20" />
      <circle cx="15" cy="12" r="1.6" fill="#FFD100" />
      <circle cx="15" cy="16" r="1.6" fill="#FF8200" />
      <circle cx="11" cy="16" r="1.6" fill="#E4002B" />

      {/* Wipro text */}
      <text
        x="30"
        y="19"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="#1E293B"
        letterSpacing="-0.3px"
      >
        wipro
      </text>
    </g>
  </svg>
);

// Infosys
export const InfosysLogo = ({ className = "h-6 w-auto" }) => (
  <svg viewBox="0 0 110 28" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <text
      x="4"
      y="21"
      fontFamily="Georgia, serif, system-ui"
      fontWeight="700"
      fontSize="21"
      fill="#0070AD"
      letterSpacing="-0.5px"
    >
      Infosys
    </text>
  </svg>
);

// Capgemini
export const CapgeminiLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 120 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(2, 4)">
      {/* Capgemini wordmark */}
      <text
        x="0"
        y="18"
        fontFamily="'Brush Script MT', 'Segoe Script', cursive, sans-serif"
        fontWeight="bold"
        fontSize="19"
        fill="#0070AD"
      >
        Capgemini
      </text>
      {/* Ace of Spades emblem */}
      <path
        d="M98 7C96 3 91 3 89 6C87 3 82 3 80 7C78 11 85 16 89 19C93 16 100 11 98 7ZM89 17C89 19 87 21 86 22H92C91 21 89 19 89 17Z"
        fill="#0070AD"
      />
    </g>
  </svg>
);

// Accenture
export const AccentureLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 115 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(2, 4)">
      {/* Accenture text */}
      <text
        x="2"
        y="19"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="#111827"
        letterSpacing="-0.5px"
      >
        accenture
      </text>
      {/* Purple > symbol over 't' */}
      <path
        d="M58 3L65 7.5L58 12"
        stroke="#A100FF"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

// Cognizant
export const CognizantLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 120 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(2, 3)">
      {/* Blue circular geometric mark */}
      <circle cx="12" cy="13" r="10" stroke="#0033A0" strokeWidth="2.5" fill="none" strokeDasharray="50 14" />
      <circle cx="12" cy="13" r="4.5" fill="#0033A0" />

      {/* Cognizant wordmark */}
      <text
        x="28"
        y="19"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="16"
        fill="#0033A0"
        letterSpacing="-0.3px"
      >
        Cognizant
      </text>
    </g>
  </svg>
);

// Amazon
export const AmazonLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 115 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(4, 2)">
      <text x="0" y="20" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="18" fill="#111827" letterSpacing="-0.5px">
        amazon
      </text>
      <path d="M4 25C18 29 42 29 58 23" stroke="#FF9900" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M54 21L60 23.5L57 26.5" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  </svg>
);

// Microsoft
export const MicrosoftLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 120 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(4, 5)">
      <rect x="0" y="0" width="9.5" height="9.5" fill="#F25022" rx="1" />
      <rect x="11.5" y="0" width="9.5" height="9.5" fill="#7FBA00" rx="1" />
      <rect x="0" y="11.5" width="9.5" height="9.5" fill="#00A4EF" rx="1" />
      <rect x="11.5" y="11.5" width="9.5" height="9.5" fill="#FFB900" rx="1" />
      <text x="28" y="16" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif" fontWeight="700" fontSize="15" fill="#4B5563" letterSpacing="-0.3px">
        Microsoft
      </text>
    </g>
  </svg>
);

// Google
export const GoogleLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 115 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(4, 5)">
      <path d="M20 11C20 10.3 19.9 9.6 19.8 9H10V13.2H15.6C15.4 14.4 14.6 15.5 13.5 16.2V18.7H17C19.1 16.8 20.3 14 20.3 11Z" fill="#4285F4" />
      <path d="M10 21.5C12.9 21.5 15.3 20.5 17 18.7L13.5 16.2C12.6 16.8 11.4 17.2 10 17.2C7.2 17.2 4.8 15.3 3.9 12.8H0.3V15.4C2.1 19 5.8 21.5 10 21.5Z" fill="#34A853" />
      <path d="M3.9 12.8C3.7 12 3.6 11.1 3.6 10.3C3.6 9.4 3.7 8.5 3.9 7.7V5.1H0.3C-0.4 6.7 -0.8 8.4 -0.8 10.3C-0.8 12.1 -0.4 13.8 0.3 15.4L3.9 12.8Z" fill="#FBBC05" />
      <path d="M10 3.3C11.6 3.3 13 3.9 14.1 4.9L17.1 1.9C15.3 0.2 12.8 -0.8 10 -0.8C5.8 -0.8 2.1 1.7 0.3 5.1L3.9 7.7C4.8 5.2 7.2 3.3 10 3.3Z" fill="#EA4335" />
      <text x="26" y="16" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="16" fill="#1F2937">
        Google
      </text>
    </g>
  </svg>
);

// Deloitte
export const DeloitteLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 115 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(4, 5)">
      <text x="0" y="16" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="17" fill="#111827" letterSpacing="-0.5px">
        Deloitte
      </text>
      <circle cx="68" cy="15" r="2.8" fill="#86BC25" />
    </g>
  </svg>
);

// HCLTech
export const HCLLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 110 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(4, 5)">
      <text x="0" y="17" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="18" fill="#0072CE" letterSpacing="0.5px">
        HCL<tspan fill="#00C1DE">Tech</tspan>
      </text>
    </g>
  </svg>
);

// Tech Mahindra
export const TechMahindraLogo = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 130 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(2, 5)">
      <rect x="2" y="2" width="11" height="11" rx="2" transform="rotate(45 7.5 7.5)" fill="#E31837" />
      <text x="21" y="15" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="13" fill="#E31837" letterSpacing="-0.3px">
        Tech <tspan fill="#374151" fontWeight="600">Mahindra</tspan>
      </text>
    </g>
  </svg>
);


// ── Domain Vector Icons ───────────────────────────────────────────────────────

// 1. Python
export const PythonIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.5 4C14.4 4 15 7.9 15 7.9L15.01 12H24V13.3H10.5C5.8 13.3 2 17 2 24C2 31.2 5.5 30.6 5.5 30.6H9.7V26.2C9.7 20.8 14.1 20.6 14.1 20.6H23.5C28.2 20.6 30 17 30 13.3C30 9.2 28.5 4 23.5 4ZM19.2 7.7C20.2 7.7 21 8.5 21 9.5C21 10.5 20.2 11.3 19.2 11.3C18.2 11.3 17.4 10.5 17.4 9.5C17.4 8.5 18.2 7.7 19.2 7.7Z"
      fill="#3776AB"
    />
    <path
      d="M24.5 44C33.6 44 33 40.1 33 40.1L32.99 36H24V34.7H37.5C42.2 34.7 46 31 46 24C46 16.8 42.5 17.4 42.5 17.4H38.3V21.8C38.3 27.2 33.9 27.4 33.9 27.4H24.5C19.8 27.4 18 31 18 34.7C18 38.8 19.5 44 24.5 44ZM28.8 40.3C27.8 40.3 27 39.5 27 38.5C27 37.5 27.8 36.7 28.8 36.7C29.8 36.7 30.6 37.5 30.6 38.5C30.6 39.5 29.8 40.3 28.8 40.3Z"
      fill="#FFD43B"
    />
  </svg>
);

// 2. Java
export const JavaIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 18H18C18 19.66 16.66 21 15 21H9C7.34 21 6 19.66 6 18Z"
      fill="#EA2D2E"
    />
    <path
      d="M4 10H17V15C17 16.66 15.66 18 14 18H7C5.34 18 4 16.66 4 15V10Z"
      fill="#EA2D2E"
      opacity="0.9"
    />
    <path
      d="M17 11H18.5C19.88 11 21 12.12 21 13.5C21 14.88 19.88 16 18.5 16H17V11Z"
      stroke="#EA2D2E"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Steam curls */}
    <path
      d="M8 7C8 5.5 9.5 4.5 9.5 3"
      stroke="#EA2D2E"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M13 7C13 5.5 14.5 4.5 14.5 3"
      stroke="#F89820"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// 3. DSA (Data Structures & Algorithms)
export const DSAIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tree nodes connected */}
    <circle cx="12" cy="5" r="3" fill="#10B981" />
    <circle cx="6" cy="18" r="3" fill="#10B981" />
    <circle cx="18" cy="18" r="3" fill="#10B981" />
    <line x1="10.2" y1="7.4" x2="7.8" y2="15.6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    <line x1="13.8" y1="7.4" x2="16.2" y2="15.6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    <line x1="9" y1="18" x2="15" y2="18" stroke="#10B981" strokeWidth="1.8" strokeDasharray="2 2" strokeLinecap="round" />
  </svg>
);

// 4. DBMS (Database Management Systems)
export const DBMSIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="5" rx="8" ry="3" stroke="#EC4899" strokeWidth="2" fill="#FCE7F3" />
    <path d="M4 5V11C4 12.66 7.58 14 12 14C16.42 14 20 12.66 20 11V5" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 11V17C4 18.66 7.58 20 12 20C16.42 20 20 18.66 20 17V11" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 5. Operating Systems
export const OSIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke="#8B5CF6" strokeWidth="2" />
    <path
      d="M12 2V5M12 19V22M2 12H5M19 12H22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M4.93 19.07L7.05 16.95M16.95 7.05L19.07 4.93"
      stroke="#8B5CF6"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 6. OOP (Object-Oriented Programming)
export const OOPIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Isometric 3D Cube */}
    <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 12L20 7.5" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 12V21" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 12L4 7.5" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="#F59E0B" />
  </svg>
);

// 7. Web Development
export const WebDevIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#06B6D4" strokeWidth="2" />
    <ellipse cx="12" cy="12" rx="4.5" ry="9" stroke="#06B6D4" strokeWidth="1.8" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="#06B6D4" strokeWidth="1.8" />
  </svg>
);

// 8. Machine Learning
export const MLIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Brain / Neural nodes */}
    <circle cx="6" cy="8" r="2" fill="#D946EF" />
    <circle cx="6" cy="16" r="2" fill="#D946EF" />
    <circle cx="12" cy="5" r="2" fill="#D946EF" />
    <circle cx="12" cy="12" r="2.5" fill="#A855F7" />
    <circle cx="12" cy="19" r="2" fill="#D946EF" />
    <circle cx="18" cy="8" r="2" fill="#D946EF" />
    <circle cx="18" cy="16" r="2" fill="#D946EF" />
    <line x1="6" y1="8" x2="12" y2="5" stroke="#D946EF" strokeWidth="1.5" />
    <line x1="6" y1="8" x2="12" y2="12" stroke="#D946EF" strokeWidth="1.5" />
    <line x1="6" y1="16" x2="12" y2="12" stroke="#D946EF" strokeWidth="1.5" />
    <line x1="6" y1="16" x2="12" y2="19" stroke="#D946EF" strokeWidth="1.5" />
    <line x1="12" y1="5" x2="18" y2="8" stroke="#D946EF" strokeWidth="1.5" />
    <line x1="12" y1="12" x2="18" y2="8" stroke="#D946EF" strokeWidth="1.5" />
    <line x1="12" y1="12" x2="18" y2="16" stroke="#D946EF" strokeWidth="1.5" />
    <line x1="12" y1="19" x2="18" y2="16" stroke="#D946EF" strokeWidth="1.5" />
  </svg>
);

// 9. HR & Behavioral
export const HRIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="3" fill="#6366F1" />
    <path d="M3 18C3 15 5.5 13 9 13C12.5 13 15 15 15 18" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
    <circle cx="17" cy="9" r="2.5" fill="#818CF8" />
    <path d="M15.5 17C15.8 15.5 17.2 14.5 19.5 14.5C21 14.5 22 15.5 22 17" stroke="#818CF8" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 10. Cloud & DevOps
export const CloudIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 19C4.01472 19 2 16.9853 2 14.5C2 12.1564 3.79151 10.2313 6.07923 10.0245C6.5414 6.6433 9.43128 4 13 4C17.0864 4 20.4571 7.10842 20.7303 11.1718C21.4674 11.6974 22 12.5445 22 13.5C22 15.433 20.433 17 18.5 17H16" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 13V21M9 16L12 13L15 16" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 11. System Design
export const SystemDesignIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="6" height="5" rx="1.5" stroke="#8B5CF6" strokeWidth="2" fill="#8B5CF6" fillOpacity="0.2" />
    <rect x="15" y="3" width="6" height="5" rx="1.5" stroke="#8B5CF6" strokeWidth="2" fill="#8B5CF6" fillOpacity="0.2" />
    <rect x="9" y="16" width="6" height="5" rx="1.5" stroke="#8B5CF6" strokeWidth="2" fill="#8B5CF6" fillOpacity="0.2" />
    <path d="M6 8V11C6 12 7 13 8 13H16C17 13 18 12 18 11V8M12 13V16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 12. Computer Networks
export const NetworksIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="3" stroke="#14B8A6" strokeWidth="2" fill="#14B8A6" fillOpacity="0.2" />
    <circle cx="5" cy="18" r="3" stroke="#14B8A6" strokeWidth="2" fill="#14B8A6" fillOpacity="0.2" />
    <circle cx="19" cy="18" r="3" stroke="#14B8A6" strokeWidth="2" fill="#14B8A6" fillOpacity="0.2" />
    <path d="M10 7L6.5 15.5M14 7L17.5 15.5M7.5 18H16.5" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 13. Data Analyst / Analytics
export const DataAnalystIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="13" width="4" height="8" rx="1" fill="#3B82F6" />
    <rect x="10" y="8" width="4" height="13" rx="1" fill="#8B5CF6" />
    <rect x="17" y="4" width="4" height="17" rx="1" fill="#10B981" />
    <path d="M4 11L10 6L16 10L21 4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

