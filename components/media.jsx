import React from "react";
import { IfElse } from "../helpers";

export default function Media({ data }) {
  const { src, svg_markup, size = {} } = data;
  const { height = "auto", width = "auto" } = size;

  return (
    <>
      {IfElse(src, () => (
        <img src={src} height={height} width={width} />
      ))}
      {IfElse(svg_markup, () => (
        <span
          className="flex svg"
          dangerouslySetInnerHTML={{ __html: svg_markup }}
        ></span>
      ))}
      {IfElse(
        !src && !svg_markup,
        <div className="flex min-w-40 min-h-16">
          <place-holder>
            <span data-info className="z-10 py-1.5">
              Add Image
            </span>
          </place-holder>
        </div>
      )}
    </>
  );
}
