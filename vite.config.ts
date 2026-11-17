import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  // GitHub Pages hosts this repository below /SocialMediaApp/.
  base: process.env.GITHUB_ACTIONS === "true" ? "/SocialMediaApp/" : "/",
  plugins: [react(), tailwindcss(), flowbiteReact()],
  optimizeDeps: {
    include: ["react-detect-offline", "prop-types"],
  },
});
