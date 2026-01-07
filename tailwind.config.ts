import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom colors for strength levels
      colors: {
        strength: {
          veryWeak: '#dc2626',
          weak: '#ea580c',
          ok: '#ca8a04',
          strong: '#16a34a',
          veryStrong: '#059669',
        },
      },
      // Large sizes for presenter mode
      fontSize: {
        'presenter-sm': '1.25rem',
        'presenter-base': '1.5rem',
        'presenter-lg': '2rem',
        'presenter-xl': '2.5rem',
        'presenter-2xl': '3rem',
      },
    },
  },
  plugins: [],
};

export default config;
