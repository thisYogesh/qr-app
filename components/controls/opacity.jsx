import React from "react";
import Input from "../input";

export default function TypeOpacity({ field }) {
  const { field: opacity } = field;
  const { value, "@title": title } = opacity;

  return (
    <div className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <Input type="range" value={value} min="0" max="10" />
    </div>
  );
}
