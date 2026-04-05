import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f5f3ef",
        ink: "#111111",
        muted: "#6b6b6b",
        line: "#dfd9d0",
        panel: "#fbfaf7",
        accent: "#1d4ed8",
        success: "#0f766e",
        warning: "#9a3412"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17, 17, 17, 0.08)",
        panel: "0 12px 30px rgba(17, 17, 17, 0.06)"
      },
      backgroundImage: {
        "mesh-neutral":
          "radial-gradient(circle at top left, rgba(255,255,255,0.96), rgba(245,243,239,0.9) 42%, rgba(226,220,210,0.75) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
