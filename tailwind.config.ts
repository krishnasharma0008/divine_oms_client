import withMT from "@material-tailwind/react/utils/withMT";
import colors from "tailwindcss/colors";

//import type { Config } from "tailwindcss";
module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/wrapper/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/screens/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(201.65deg, rgba(215, 243, 255, 0.7) 0.15%, rgba(255, 152, 171, 0.7) 42.45%, rgba(242, 145, 46, 0.7) 100%)",
      },
      colors: {
        ...colors,
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
});
