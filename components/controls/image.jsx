import React from "react";
import { MEDIA_TYPE } from "../../src/enum";
import ControlRenderer from "./render";

export default function TypeImage({ field, ...props }) {
  const { field: image, fields } = field;
  const { "@title": title, options } = image;

  const renderControls = () => {
    return (
      <>
        {fields.map((field, index) => (
          <ControlRenderer key={index} field={field} />
        ))}
      </>
    );
  };
  return (
    <div {...props} className="flex flex-col gap-2">
      {title ? <h4 className="capitalize text-sm">{title}</h4> : null}
      <media-control className="media-control">
        <div className="flex flex-col gap-2">
          <div className="media-control__preview bg-gray-100 border border-dashed border-gray-300 flex rounded justify-center">
            {image.src ? (
              <>
                <img
                  src={image.src}
                  className="media-control__preview-img w-32 h-32 object-contain image-bg"
                />
                <div className="hidden media-control__preview-svg w-32 h-32 image-bg"></div>
                <p className="media-control__preview-none hidden flex items-center h-32 text-sm text-gray-400">
                  No Image Selected
                </p>
                <input type="hidden" name="type" value={MEDIA_TYPE.DEFAULT} />
              </>
            ) : image.svg_markup ? (
              <>
                <img className="hidden media-control__preview-img w-32 h-32 object-contain image-bg" />
                <div
                  className="media-control__preview-svg w-32 h-32 image-bg"
                  dangerouslySetInnerHTML={{ __html: image.svg_markup }}
                ></div>
                <p className="media-control__preview-none hidden flex items-center h-32 text-sm text-gray-400">
                  No Image Selected
                </p>
                <input
                  type="hidden"
                  name="type"
                  value={MEDIA_TYPE.SVG_MARKUP}
                />
              </>
            ) : (
              <>
                <img className="hidden media-control__preview-img w-32 h-32 object-contain image-bg" />
                <div className="hidden media-control__preview-svg w-32 h-32 image-bg"></div>
                <p className="media-control__preview-none flex items-center h-32 text-sm text-gray-400">
                  No Image Selected
                </p>
                <input type="hidden" name="type" />
              </>
            )}
          </div>

          <div className="media-control__actions flex gap-1">
            <button
              data-action="upload"
              className="button basis-0 grow shrink-0"
            >
              Upload Image
            </button>
            {options?.svg !== false ? (
              <button
                data-action="svg-markup"
                className="button basis-0 grow shrink-0"
              >
                SVG Markup
              </button>
            ) : null}
          </div>
        </div>
      </media-control>
      {fields?.length > 0 ? renderControls() : null}
    </div>
  );
}
