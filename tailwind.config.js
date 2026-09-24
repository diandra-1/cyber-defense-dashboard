module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#F8F9FB',
        surface: '#FFFFFF',
        obsidian: {
          900: '#111215',
          800: '#181A1F',
          700: '#23262E',
          600: '#323742',
        },
        signal: {
          coral: '#F2542D',
          'coral-light': 'rgba(242, 84, 45, 0.08)',
          blue: '#2563EB',
          'blue-light': 'rgba(37, 99, 235, 0.08)',
          emerald: '#10B981',
          'emerald-light': 'rgba(16, 185, 129, 0.08)',
          amber: '#F59E0B',
          'amber-light': 'rgba(245, 158, 11, 0.08)',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
          border: 'rgba(15, 23, 42, 0.08)',
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.03), 0 4px 14px rgba(0,0,0,0.02)',
        'elevated': '0 10px 30px -4px rgba(15, 23, 42, 0.06), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        'tactile': '0 2px 0 rgba(0,0,0,0.05)',
        'modal': '0 25px 60px -15px rgba(15, 23, 42, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scanLine 3s linear infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        scanLine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}