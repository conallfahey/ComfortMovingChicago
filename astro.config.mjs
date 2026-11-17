import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://comfortmovingchicago.com",
  output: "static",
  outDir: "./.cloudflare/site",
  build: { format: "preserve" },
  compressHTML: false,
  devToolbar: { enabled: false },
});
