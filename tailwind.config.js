/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#07090E', // Đen điện ảnh sâu nhưng dịu mắt
          900: '#0B0E17', // Nền chính tiêu chuẩn
          850: '#111522',
          800: '#161B2B', // Thẻ phim & Card bề mặt
          700: '#22293F',
          600: '#2E3754',
        },
        cinemora: {
          primary: '#E50914',   // Đỏ điện ảnh rực rỡ (Cinema Red)
          accent: '#00F0FF',    // Xanh ngọc Cyan thanh thoát
          amber: '#F59E0B',     // Vàng sao IMDb
          card: '#161B2B',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', '"Be Vietnam Pro"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 35px -8px rgba(229, 9, 20, 0.4)',
        'glow-cyan': '0 0 35px -8px rgba(0, 240, 255, 0.3)',
        'cinematic': '0 20px 40px -15px rgba(0, 0, 0, 0.9)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
