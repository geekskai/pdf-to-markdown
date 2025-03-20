module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./src/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
      },
      lineHeight: {
        11: "2.75rem",
        12: "3rem",
        13: "3.25rem",
        14: "3.5rem",
      },

      colors: {
        primary: {
          50: "#FFEEED", // Soft pink
          100: "#FFD5D3",
          200: "#FFABA8",
          300: "#FF817C",
          400: "#FF5751",
          500: "#FF6B6B", // Base color
          600: "#D95353",
          700: "#B33A3A",
          800: "#8C2222",
          900: "#660A0A",
        },
        stone: {
          50: "#F5F5F5", // Ultra-light gray
          100: "#D9D9D9",
          200: "#B3B3B3",
          300: "#8C8C8C",
          400: "#666666",
          500: "#2A2A2A", // Base color
          600: "#222222",
          700: "#1A1A1A",
          800: "#121212",
          900: "#0A0A0A", // Near-black
        },
        coralred: {
          50: "#FFEEED", // Soft pink
          100: "#FFD5D3",
          200: "#FFABA8",
          300: "#FF817C",
          400: "#FF5751",
          500: "#FF6B6B", // Base color
          600: "#D95353",
          700: "#B33A3A",
          800: "#8C2222",
          900: "#660A0A", // Deep burgundy
        },
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
