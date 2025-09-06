import path from "path";
import { getInteratorValues } from "../helpers";
import fs from "fs/promises";

export default () => {
  return {
    name: "include-svg",
    async transformIndexHtml(html) {
      const mataches = html.matchAll(/<include-svg src="(.*?)"\s*\/>/gi);
      const chunkMap = new Map();

      if (mataches) {
        const values = getInteratorValues(mataches);
        for (const value of values) {
          const { 0: declation, 1: sourcePath } = value;

          if (chunkMap.has(declation)) continue;

          const content = await fs.readFile(
            path.resolve() + sourcePath,
            "utf-8"
          );

          chunkMap.set(declation, content);
        }
      }

      [...chunkMap.keys()].forEach(declation => {
        const modifiedContent = html.replaceAll(
          declation,
          chunkMap.get(declation)
        );
        html = modifiedContent;
      });

      return html;
    }
  };
};
