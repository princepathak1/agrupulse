'use client';

import React from 'react';

interface ProduceIllustrationProps {
  commodityId: string;
  className?: string;
}

export function ProduceIllustration({ commodityId, className = 'w-full h-full' }: ProduceIllustrationProps) {
  switch (commodityId) {
    case 'tomato':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Subtle glow backdrop */}
          <circle cx="100" cy="105" r="75" fill="#EF4444" fillOpacity="0.15" />
          {/* Main tomato lobes */}
          <circle cx="82" cy="110" r="50" fill="#DC2626" />
          <circle cx="118" cy="110" r="50" fill="#B91C1C" />
          <circle cx="100" cy="102" r="55" fill="#EF4444" />
          {/* Highlights & gloss */}
          <ellipse cx="78" cy="82" rx="16" ry="10" transform="rotate(-25 78 82)" fill="#F87171" fillOpacity="0.6" />
          {/* Stem calyx */}
          <path d="M100 48 L100 68" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />
          <path d="M100 66 Q80 62 65 52 Q82 72 96 74" fill="#22C55E" />
          <path d="M100 66 Q120 62 135 52 Q118 72 104 74" fill="#16A34A" />
          <path d="M100 66 Q100 80 100 85 Q92 75 100 66" fill="#15803D" />
          {/* Natural ripening / soft spot mark */}
          <ellipse cx="125" cy="120" rx="12" ry="9" fill="#991B1B" fillOpacity="0.4" />
        </svg>
      );

    case 'banana':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="100" r="75" fill="#FACC15" fillOpacity="0.15" />
          {/* Crown */}
          <rect x="145" y="45" width="16" height="18" rx="3" fill="#713F12" transform="rotate(25 145 45)" />
          {/* Main Banana Arc */}
          <path
            d="M150 55 C120 70 60 105 45 145 C75 155 125 130 160 85 C162 70 158 58 150 55 Z"
            fill="#EAB308"
            stroke="#CA8A04"
            strokeWidth="2"
          />
          {/* Ridge highlight */}
          <path
            d="M148 62 C115 85 70 115 55 142"
            stroke="#FEF08A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Sugar spots (ripening blemishes) */}
          <circle cx="85" cy="125" r="3" fill="#78350F" />
          <circle cx="95" cy="118" r="2.5" fill="#78350F" />
          <circle cx="115" cy="105" r="3.5" fill="#78350F" />
          <circle cx="125" cy="95" r="2" fill="#78350F" />
          <circle cx="70" cy="135" r="2.5" fill="#78350F" />
          <circle cx="138" cy="80" r="3" fill="#78350F" />
          {/* Tip */}
          <circle cx="45" cy="145" r="5" fill="#713F12" />
        </svg>
      );

    case 'mango':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="105" r="75" fill="#F59E0B" fillOpacity="0.15" />
          {/* Alphonso teardrop body */}
          <path
            d="M95 50 C130 50 160 80 155 125 C150 155 120 170 95 165 C65 160 50 135 55 105 C60 75 75 50 95 50 Z"
            fill="url(#mangoGrad)"
            stroke="#D97706"
            strokeWidth="2"
          />
          {/* Gloss highlight */}
          <path
            d="M80 70 C72 90 70 115 75 135"
            stroke="#FEF3C7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          {/* Stem */}
          <path d="M95 48 C94 40 92 34 85 30" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M92 48 Q102 38 115 42" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="mangoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'potato':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="105" r="75" fill="#B45309" fillOpacity="0.12" />
          {/* Irregular tuber oval */}
          <path
            d="M60 85 C65 65 95 60 125 70 C150 80 160 110 150 135 C140 155 110 160 85 155 C55 150 45 125 50 105 Z"
            fill="#D97706"
            stroke="#B45309"
            strokeWidth="2"
          />
          {/* Inner shadow */}
          <path
            d="M65 95 C75 135 115 150 140 135"
            stroke="#92400E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
          {/* Potato eyes */}
          <ellipse cx="80" cy="85" rx="4" ry="2" fill="#78350F" />
          <ellipse cx="115" cy="90" rx="5" ry="2.5" fill="#78350F" />
          <ellipse cx="130" cy="120" rx="4" ry="2" fill="#78350F" />
          <ellipse cx="90" cy="130" rx="5" ry="2.5" fill="#78350F" />
          <ellipse cx="65" cy="115" rx="3.5" ry="2" fill="#78350F" />
        </svg>
      );

    case 'onion':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="105" r="75" fill="#9333EA" fillOpacity="0.15" />
          {/* Onion Body */}
          <path
            d="M100 45 C135 70 155 105 145 140 C135 165 115 170 100 170 C85 170 65 165 55 140 C45 105 65 70 100 45 Z"
            fill="#A855F7"
            stroke="#7E22CE"
            strokeWidth="2"
          />
          {/* Root tuft */}
          <path d="M96 170 L94 182 M100 170 L100 185 M104 170 L106 182" stroke="#E9D5FF" strokeWidth="2" strokeLinecap="round" />
          {/* Paper skin layers */}
          <path d="M100 50 C115 75 125 110 120 150" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 50 C85 75 75 110 80 150" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 45 L100 35" stroke="#6B21A8" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    default: // Apple
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="105" r="75" fill="#E11D48" fillOpacity="0.15" />
          {/* Apple Heart shape lobes */}
          <path
            d="M100 65 C85 45 55 50 50 85 C45 125 70 165 100 165 C130 165 155 125 150 85 C145 50 115 45 100 65 Z"
            fill="#E11D48"
            stroke="#BE123C"
            strokeWidth="2"
          />
          {/* Gloss */}
          <ellipse cx="75" cy="85" rx="10" ry="16" transform="rotate(-20 75 85)" fill="#FDA4AF" fillOpacity="0.6" />
          {/* Stem & Leaf */}
          <path d="M100 62 C102 45 108 35 115 30" stroke="#713F12" strokeWidth="4" strokeLinecap="round" />
          <path d="M104 50 Q118 42 130 48 Q118 60 104 50 Z" fill="#22C55E" />
        </svg>
      );
  }
}
