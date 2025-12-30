import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#06b6d4', // Cyan-500
          borderRadius: '8px', // Squircle-ish
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1V4" />
          <path d="M15 1V4" />
          <path d="M9 20V23" />
          <path d="M15 20V23" />
          <path d="M20 9H23" />
          <path d="M20 15H23" />
          <path d="M1 9H4" />
          <path d="M1 15H4" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
