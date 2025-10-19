import React from "react";

export default function AppBg({ data }) {
  const { bg_size, image, opacity } = data;
  const { height = "auto", width = "auto" } = bg_size;

  return (
    <div
      className="app-bg absolute inset-0"
      style={{
        "--bg-image": `url(${image.src})`,
        "--bg-opacity": opacity.value,
        "--bg-size": `${height} ${width}`
      }}
    ></div>
  );
}
