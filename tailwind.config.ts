import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "heritage-blue": "#002D72",
        "spirit-blue": "#68ACE5",
      },
      maxHeight: {
        "90-screen": "90vh",
        "80-screen": "80vh",
      },
      fontFamily: {
        google: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
