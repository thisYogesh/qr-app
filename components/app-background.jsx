import React from "react";
import { handleUnit } from "../src/utils";

export default function AppBg({ data }) {
  const { bg_size, image, opacity } = data;
  const { height, width } = bg_size;

  return (
    <div
      className="app-bg absolute inset-0"
      style={{
        "--bg-image": `url(${image.src})`,
        "--bg-opacity": opacity.value,
        "--bg-size": `${handleUnit(height)} ${handleUnit(width)}`
      }}
    ></div>
  );
}
