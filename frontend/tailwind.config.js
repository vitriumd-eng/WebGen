/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors (Gemini style)
        light: {
          bg: '#ffffff',
          surface: '#f8f9fa',
          elevated: '#ffffff',
          border: '#e8eaed',
          hover: '#f1f3f4',
        },
        accent: {
          primary: '#1a73e8',
          secondary: '#34a853',
          purple: '#9334e6',
          orange: '#f9ab00',
          danger: '#ea4335',
        },
        text: {
          primary: '#202124',
          secondary: '#5f6368',
          muted: '#80868b',
          inverse: '#ffffff',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-accent': 'linear-gradient(135deg, #1a73e8 0%, #34a853 100%)',
        'gradient-purple': 'linear-gradient(135deg, #9334e6 0%, #ea4335 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f9ab00 0%, #ea4335 100%)',
        'gradient-gemini': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)',
        'soft-lg': '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',
        'gemini': '0 8px 16px 0 rgba(60, 64, 67, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      }
    },
  },
  plugins: [],
}

