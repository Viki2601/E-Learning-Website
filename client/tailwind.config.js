/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-radial': 'radial-gradient(circle at top left, rgb(195, 195, 195) 0%, rgb(195, 195, 195) 2%,rgb(202, 202, 202) 2%, rgb(202, 202, 202) 23%,rgb(209, 209, 209) 23%, rgb(209, 209, 209) 55%,rgb(217, 217, 217) 55%, rgb(217, 217, 217) 80%,rgb(224, 224, 224) 80%, rgb(224, 224, 224) 86%,rgb(231, 231, 231) 86%, rgb(231, 231, 231) 96%,rgb(238, 238, 238) 96%, rgb(238, 238, 238) 100%);',
        'custom-radial-1': 'linear-gradient(0deg, transparent 0%, transparent 58%,rgba(104, 104, 104,0.05) 58%, rgba(104, 104, 104,0.05) 92%,transparent 92%, transparent 100%),linear-gradient(45deg, transparent 0%, transparent 34%,rgba(104, 104, 104,0.05) 34%, rgba(104, 104, 104,0.05) 77%,transparent 77%, transparent 100%),linear-gradient(0deg, transparent 0%, transparent 33%,rgba(104, 104, 104,0.05) 33%, rgba(104, 104, 104,0.05) 53%,transparent 53%, transparent 100%),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255));',
      },
      keyframes: {
        slideRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        slideRight: 'slideRight 1.5s ease-out',
        slideLeft: 'slideLeft 1.5s ease-out',
        slideUp: 'slideUp 1.5s ease-out',
      },
    },
  },
  plugins: [],
}