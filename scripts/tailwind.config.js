/** Tailwind v3.4.17 config mirroring the sites' inline Play-CDN config. */
module.exports = {
  darkMode: "class",
  content: [
    "./*.html",
    "./script.js",
    "./site-loader.js",
    "./protein-scroll.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2a4b2c",
        "primary-hover": "#1f3721",
        "primary-light": "#eef6f0",
        "primary-soft": "rgba(42, 75, 44, 0.08)",
        "brand-green": "#2a4b2c",
        "brand-dark": "#1a1a1a",
        "brand-muted": "#555555",
        "brand-subtle": "#767676",
        "brand-border": "#e0e0e0",
        "brand-border-subtle": "rgba(0, 0, 0, 0.07)",
        "brand-bg": "#ffffff",
        "brand-offwhite": "#f8f7f2",
        "bg-white": "#ffffff",
        "bg-off-white": "#f8f7f2",
        surface: "#ffffff",
        "surface-offwhite": "#f8f7f2",
        "surface-variant": "#eef6f0",
        "text-primary": "#1a1a1a",
        "text-secondary": "#555555",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "Plus Jakarta Sans", "sans-serif"],
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
