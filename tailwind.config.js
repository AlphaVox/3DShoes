/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // iOS 风格颜色
        ios: {
          blue: '#007AFF',
          gray: {
            100: '#F2F2F7',
            200: '#E5E5EA',
            300: '#D1D1D6',
            400: '#C7C7CC',
            500: '#AEAEB2',
            600: '#8E8E93',
            700: '#636366',
            800: '#48484A',
            900: '#3A3A3C',
          }
        },
        primary: '#007AFF',
        secondary: '#5856D6',
        success: '#34C759',
        warning: '#FF9500',
        danger: '#FF3B30',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'ios': '0 0 20px rgba(0, 0, 0, 0.05)',
        'ios-card': '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'ios': '10px',
        'ios-lg': '14px',
      },
    },
  },
  plugins: [],
}
