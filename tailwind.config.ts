import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './messages/**/*.{json,md}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E1F5EE',
          100: '#B3E4D1',
          400: '#1D9E75',
          500: '#178260',
          600: '#0F6E56',
          700: '#085041',
          800: '#04342C'
        },
        heritage: {
          50: '#FCE7E3',
          100: '#F8C7BE',
          400: '#D54832',
          500: '#B93724',
          700: '#7C2015'
        },
        accent: {
          50: '#FAEEDA',
          300: '#EF9F27',
          400: '#D4840E'
        },
        neutral: {
          50: '#F8F8F6',
          100: '#F0EFEA',
          200: '#E0DED7',
          600: '#65635E',
          900: '#1A1918'
        },
        success: '#1D9E75',
        warning: '#EF9F27',
        error: '#E24B4A'
      },
      borderRadius: {
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)'
      },
      spacing: {
        header: 'var(--header-height)',
        sidebar: 'var(--sidebar-width)'
      },
      boxShadow: {
        card: '0 10px 30px rgba(4, 52, 44, 0.08)'
      }
    }
  },
  plugins: [typography]
}

export default config
