
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        primary: {
          DEFAULT: "#1E4640",
          dark: "#0A332C",
        },
        accent: {
          DEFAULT: "#B5E385",
          light: "#C9E993",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
