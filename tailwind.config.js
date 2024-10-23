/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.{html,js}"],
  theme: {
    screens: {
      smallMobile: "320px",
      tablet: "640px",
      largeTablet: "768px",
      laptop: "1024px",
      largeDesktop: "1440px",
      desktopHD: "2560px",
    },
    extend: {
      animation: {
        "opacity-fade": "opacity 0.3s cubic-bezier(0.895, 0.03, 0.685, 0.22)",
      },
      keyframes: {
        opacity: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      transitionTimingFunction: {
        "custom-ease": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
      },
      colors: {
        black: "#1D1D1D ",
        tomato: "#FF6347",
      },
    },
  },
  plugins: [],
};
