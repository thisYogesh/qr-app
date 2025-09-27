import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
// import handlebars from "vite-plugin-handlebars";
import includeSvg from "./plugins/include-svg";

const injectBuildHash = () => ({
  name: "build-hash",
  generateBundle(_, bundle) {
    try {
      const file = Object.values(bundle).find(file => file.name === "index");
      const contentKey = file.type === "chunk" ? "code" : "source";

      file[contentKey] = file[contentKey].replace(
        "<build-hash>",
        `${Date.now()}`
      );
    } catch {
      console.log("Error in [build-hash] plugin!");
    }
  }
});

export default defineConfig({
  plugins: [tailwindcss(), injectBuildHash(), includeSvg()],
  assetsInclude: ["**/*.lottie"],
  server: {
    host: "app.local",
    port: 5000
    // strictPort: true
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        admin: "admin.html"
      }
    }
  }
});
