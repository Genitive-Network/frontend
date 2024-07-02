import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            50: '#ffbeba',
            DEFAULT: '#ff3b30',
          },
        }
      }
    }
  })],
  experimental: {
    // see https://github.com/tailwindlabs/tailwindcss/discussions/7317
    // this config can keep chrome devtools from showing too much inherited styles,
    // which can be helpful for debugging, and also avoid devtool crashes
    optimizeUniversalDefaults: true,
  },
};
export default config;
