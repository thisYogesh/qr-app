// import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const injectBuildHash = () => ({
  name: "build-hash",
  generateBundle(_, bundle) {
    const file = Object.values(bundle).find((file) => file.name === "index");
    const contentKey = file.type === "chunk" ? "code" : "source";

    file[contentKey] = file[contentKey].replace(
      "<build-hash>",
      `${Date.now()}`
    );
  },
});

export default defineConfig({
  plugins: [injectBuildHash()],
  assetsInclude: ["**/*.lottie"],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        admin: "admin.html",
      },
    },
  },
});
