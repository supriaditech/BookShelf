import type { Config } from 'tailwindcss';
const withMT = require('@material-tailwind/react/utils/withMT');

const config: Config = withMT({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        purple: '#6378CD',
        abuabu: '#F9F9FB',
        tosca: '#00C9AC',
        toscaDark: '#006A65',
        toscaSoft: '#B9EFD4',
      },
    },
  },
  plugins: [],
});
export default config;
