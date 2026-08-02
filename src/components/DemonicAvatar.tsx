import React from 'react';
import { TagColor } from '../types';

interface DemonicAvatarProps {
  seed?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  tagColor?: TagColor;
  className?: string;
  avatarStyle?: string;
}

export const DemonicAvatar: React.FC<DemonicAvatarProps> = ({
  seed = 'demon',
  name = '',
  size = 'md',
  tagColor,
  className = '',
  avatarStyle,
}) => {
  // Deterministic hash based on seed string
  const str = (seed + name + (avatarStyle || '')).toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);

  // Variant selections
  const skinColors = [
    { bg: '#dc2626', stroke: '#991b1b', name: 'Infernal Red' }, // Red
    { bg: '#7c3aed', stroke: '#5b21b6', name: 'Poison Purple' }, // Purple
    { bg: '#ea580c', stroke: '#9a3412', name: 'Fiery Orange' }, // Orange
    { bg: '#18181b', stroke: '#09090b', name: 'Dark Obsidian' }, // Obsidian
    { bg: '#059669', stroke: '#065f46', name: 'Emerald Ghoul' }, // Green
    { bg: '#b91c1c', stroke: '#7f1d1d', name: 'Blood Crimson' }, // Crimson
    { bg: '#4338ca', stroke: '#312e81', name: 'Void Indigo' }, // Indigo
  ];

  // Map tag color to skin preference if applicable, else pick from hash
  let skin = skinColors[absHash % skinColors.length];
  if (tagColor === 'red') {
    skin = skinColors[0]; // Red
  } else if (tagColor === 'purple') {
    skin = skinColors[1]; // Purple
  } else if (tagColor === 'green') {
    skin = skinColors[4]; // Emerald Ghoul / Clean
  }

  const eyeVariant = absHash % 4; // 0: Glowing Yellow, 1: Red Laser, 2: Purple Void, 3: Cat Eyes
  const hornVariant = (absHash >> 2) % 4; // 0: Curved Ram Horns, 1: Pointed Devil Horns, 2: Crown Horns, 3: Asymmetric Horns
  const mouthVariant = (absHash >> 4) % 4; // 0: Fangs Grin, 1: Wicked Teeth, 2: Evil Smirk, 3: Tongue Out
  const auraVariant = (absHash >> 6) % 3; // 0: Hellfire Flames, 1: Shadow Aura, 2: Bat Wings

  // Dimensions
  const dimensions = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden border-2 border-neutral-900 dark:border-neutral-700 bg-neutral-900 shrink-0 select-none shadow-md ${dimensions} ${className}`}
      title={`Demonic Character Avatar for ${name || 'Leader'}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transform hover:scale-105 transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={`grad-bg-${absHash}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#171717" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>

          <linearGradient id={`grad-skin-${absHash}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={skin.bg} />
            <stop offset="100%" stopColor={skin.stroke} />
          </linearGradient>

          <linearGradient id={`grad-horn-${absHash}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id={`grad-flame-${absHash}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>

        {/* Background Canvas */}
        <rect width="100" height="100" fill={`url(#grad-bg-${absHash})`} />

        {/* Aura / Bat Wings / Hellfire Background */}
        {auraVariant === 0 && (
          <g fill={`url(#grad-flame-${absHash})`} opacity="0.4">
            <path d="M 10 90 Q 25 40 35 60 Q 50 20 65 60 Q 75 30 90 90 Z" />
            <circle cx="20" cy="30" r="3" fill="#facc15" />
            <circle cx="80" cy="25" r="4" fill="#ef4444" />
          </g>
        )}

        {auraVariant === 2 && (
          <g fill="#09090b" opacity="0.8">
            {/* Left Bat Wing */}
            <path d="M 25 45 C 5 20 0 45 10 65 C 18 55 22 55 25 45 Z" />
            {/* Right Bat Wing */}
            <path d="M 75 45 C 95 20 100 45 90 65 C 82 55 78 55 75 45 Z" />
          </g>
        )}

        {/* Horns (Behind Head) */}
        {hornVariant === 0 && (
          // Curved Ram Horns
          <g fill={`url(#grad-horn-${absHash})`} stroke="#000" strokeWidth="1.5">
            <path d="M 32 35 C 15 15 0 25 10 45 C 18 55 28 45 32 38 Z" />
            <path d="M 68 35 C 85 15 100 25 90 45 C 82 55 72 45 68 38 Z" />
          </g>
        )}

        {hornVariant === 1 && (
          // Sharp Devil Horns
          <g fill="#dc2626" stroke="#000" strokeWidth="1.5">
            <path d="M 28 36 L 15 10 L 38 28 Z" />
            <path d="M 72 36 L 85 10 L 62 28 Z" />
          </g>
        )}

        {hornVariant === 2 && (
          // Crown of Horns
          <g fill="#f59e0b" stroke="#000" strokeWidth="1.5">
            <path d="M 25 35 L 20 12 L 35 28 L 50 8 L 65 28 L 80 12 L 75 35 Z" />
          </g>
        )}

        {hornVariant === 3 && (
          // Asymmetric Fiery Horns
          <g fill={`url(#grad-horn-${absHash})`} stroke="#000" strokeWidth="1.5">
            <path d="M 26 36 L 8 14 L 35 25 Z" />
            <path d="M 74 36 L 92 18 L 65 30 Z" />
          </g>
        )}

        {/* Demonic Head Base */}
        <ellipse
          cx="50"
          cy="56"
          rx="28"
          ry="30"
          fill={`url(#grad-skin-${absHash})`}
          stroke="#000"
          strokeWidth="2"
        />

        {/* Pointed Demon Ears */}
        <polygon points="18,50 26,42 24,58" fill={skin.bg} stroke="#000" strokeWidth="1.5" />
        <polygon points="82,50 74,42 76,58" fill={skin.bg} stroke="#000" strokeWidth="1.5" />

        {/* Angry Villain Eyebrows */}
        <path d="M 30 42 L 46 47" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        <path d="M 70 42 L 54 47" stroke="#000" strokeWidth="3" strokeLinecap="round" />

        {/* Eyes Variant */}
        {eyeVariant === 0 && (
          // Glowing Yellow Eyes with Slit Pupil
          <g>
            <ellipse cx="38" cy="49" rx="6" ry="7" fill="#facc15" stroke="#000" strokeWidth="1.5" />
            <ellipse cx="62" cy="49" rx="6" ry="7" fill="#facc15" stroke="#000" strokeWidth="1.5" />
            <line x1="38" y1="44" x2="38" y2="54" stroke="#000" strokeWidth="2.5" />
            <line x1="62" y1="44" x2="62" y2="54" stroke="#000" strokeWidth="2.5" />
          </g>
        )}

        {eyeVariant === 1 && (
          // Red Laser Glowing Eyes
          <g>
            <circle cx="38" cy="49" r="6" fill="#000" />
            <circle cx="62" cy="49" r="6" fill="#000" />
            <circle cx="38" cy="49" r="3" fill="#ef4444" />
            <circle cx="62" cy="49" r="3" fill="#ef4444" />
            <circle cx="39" cy="48" r="1" fill="#fff" />
            <circle cx="63" cy="48" r="1" fill="#fff" />
          </g>
        )}

        {eyeVariant === 2 && (
          // Hypnotic Void Eyes
          <g>
            <ellipse cx="38" cy="49" rx="7" ry="5" fill="#a855f7" stroke="#000" strokeWidth="1" />
            <ellipse cx="62" cy="49" rx="7" ry="5" fill="#a855f7" stroke="#000" strokeWidth="1" />
            <circle cx="38" cy="49" r="2" fill="#fff" />
            <circle cx="62" cy="49" r="2" fill="#fff" />
          </g>
        )}

        {eyeVariant === 3 && (
          // Sinister Cat Eyes
          <g>
            <polygon points="32,49 44,45 44,53" fill="#22c55e" stroke="#000" strokeWidth="1" />
            <polygon points="68,49 56,45 56,53" fill="#22c55e" stroke="#000" strokeWidth="1" />
            <line x1="38" y1="46" x2="38" y2="52" stroke="#000" strokeWidth="2" />
            <line x1="62" y1="46" x2="62" y2="52" stroke="#000" strokeWidth="2" />
          </g>
        )}

        {/* Demon Nose / Nostrils */}
        <polygon points="50,54 47,59 53,59" fill="#000" />

        {/* Mouth Variant */}
        {mouthVariant === 0 && (
          // Wicked Fanged Grin
          <g>
            <path d="M 34 68 Q 50 82 66 68 Z" fill="#450a0a" stroke="#000" strokeWidth="1.5" />
            {/* Top Fangs */}
            <polygon points="38,68 42,68 40,74" fill="#fff" stroke="#000" strokeWidth="0.5" />
            <polygon points="60,68 64,68 62,74" fill="#fff" stroke="#000" strokeWidth="0.5" />
            {/* Bottom Fangs */}
            <polygon points="48,77 52,77 50,71" fill="#fff" stroke="#000" strokeWidth="0.5" />
          </g>
        )}

        {mouthVariant === 1 && (
          // Sharp Teeth Row
          <g>
            <path d="M 35 68 Q 50 78 65 68" stroke="#000" strokeWidth="2.5" fill="#450a0a" />
            <path d="M 37 68 L 40 73 L 43 68 L 46 73 L 49 68 L 52 73 L 55 68 L 58 73 L 61 68" fill="#fff" stroke="#000" strokeWidth="0.5" />
          </g>
        )}

        {mouthVariant === 2 && (
          // Sinister Smirk with Vampire Fang
          <g>
            <path d="M 36 70 Q 52 75 64 65" stroke="#000" strokeWidth="2.5" fill="none" />
            <polygon points="58,68 62,68 60,74" fill="#fff" stroke="#000" strokeWidth="0.5" />
          </g>
        )}

        {mouthVariant === 3 && (
          // Tongue Out Wicked Mouth
          <g>
            <path d="M 36 67 Q 50 80 64 67 Z" fill="#18181b" stroke="#000" strokeWidth="1.5" />
            <path d="M 44 72 Q 50 84 56 72 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <polygon points="38,67 42,67 40,73" fill="#fff" stroke="#000" strokeWidth="0.5" />
            <polygon points="58,67 62,67 60,73" fill="#fff" stroke="#000" strokeWidth="0.5" />
          </g>
        )}
      </svg>
    </div>
  );
};
