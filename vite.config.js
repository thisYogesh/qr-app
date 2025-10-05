// import tailwindcss from "@tailwindcss/vite";

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

export default {
  base: "",
  assetsInclude: ["**/*.lottie"],
  plugins: [injectBuildHash()],
};
