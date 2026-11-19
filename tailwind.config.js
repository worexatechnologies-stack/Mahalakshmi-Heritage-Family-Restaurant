/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          dark: '#0c0c0d',
          surface: '#161617',
          card: '#1e1e20',
          border: '#2a2a2d',
          accent: '#d4a359',
          gold: '#cba158',
          goldLight: '#e4c489',
          cream: '#f4ede4',
          creamDark: '#d9cdbe',
          muted: '#8e8b86',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
