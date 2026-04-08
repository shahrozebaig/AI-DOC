module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },
      colors: {
        background: "hsl(0 0% 10%)",
        foreground: "hsl(0 0% 96%)",
        primary: "hsl(119 99% 46%)",
        muted: "hsl(0 0% 16%)",
        border: "hsl(0 0% 20%)",
        hero: "hsl(0 0% 8%)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};