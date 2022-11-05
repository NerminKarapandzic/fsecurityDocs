// docs/vite.config.js
import { SearchPlugin } from "vitepress-plugin-simple-search";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [SearchPlugin()],
});
