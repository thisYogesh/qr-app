/**
 * Example
 * <include-svg src="/path/to.svg" />
 */

import path from "path";
import { getInteratorValues } from "../helpers";
import fs from "fs/promises";

const replaceContent = async content => {
  const mataches = content.matchAll(/<include-svg src="(.*?)"\s*\/>/gi);
  const chunkMap = new Map();

  if (mataches) {
    const values = getInteratorValues(mataches);
    for (const value of values) {
      const { 0: declation, 1: sourcePath } = value;

      if (chunkMap.has(declation)) continue;

      const content = await fs.readFile(path.resolve() + sourcePath, "utf-8");

      chunkMap.set(declation, content);
    }
  }

  [...chunkMap.keys()].forEach(declation => {
    const modifiedContent = content.replaceAll(
      declation,
      chunkMap.get(declation)
    );
    content = modifiedContent;
  });

  return content;
};

export default () => {
  return {
    name: "include-svg",

    async transform(code, id) {
      if (id.endsWith(".js")) {
        const modifiedCode = await replaceContent(code);
        return modifiedCode;
      }
    },

    async transformIndexHtml(html) {
      const modifiedHtml = await replaceContent(html);
      return modifiedHtml;
    }
  };
};
