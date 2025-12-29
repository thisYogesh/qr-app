import React from "react";
import { handleUnit } from "../src/utils";
import domPurify from "../plugins/dompurify";

export default function Media({ data }) {
  const { src, svg_markup, size = {} } = data;
  const { height, width } = size;

  return (
    <>
      {src ? (
        <img
          src={src}
          style={{
            height: handleUnit(height),
            width: handleUnit(width)
          }}
        />
      ) : null}

      {svg_markup ? (
        <span
          className="flex svg"
          dangerouslySetInnerHTML={{ __html: domPurify.sanitize(svg_markup) }}
        ></span>
      ) : null}

      {!src && !svg_markup ? (
        <div className="flex min-w-40 min-h-16">
          <place-holder>
            <span data-info className="z-10 py-1.5">
              Add Image
            </span>
          </place-holder>
        </div>
      ) : null}
    </>
  );
}
