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
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        paper: '#080A0F',
        surface: '#0D1117',
        bento: '#0D1117',
        obsidian: {
          950: '#06080B',
          900: '#080A0F',
          800: '#0D1117',
          700: '#161B22',
          600: '#21262D',
        },
        signal: {
          coral: 'var(--signal-coral)',
          'coral-light': 'var(--signal-coral-bg)',
          blue: 'var(--signal-blue)',
          'blue-light': 'var(--signal-blue-bg)',
          emerald: 'var(--signal-emerald)',
          'emerald-light': 'var(--signal-emerald-bg)',
          amber: 'var(--signal-amber)',
          'amber-light': 'var(--signal-amber-bg)',
        },
        ink: {
          primary: 'var(--ink-primary)',
          secondary: 'var(--ink-secondary)',
          muted: 'var(--ink-muted)',
          border: 'var(--hairline)',
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