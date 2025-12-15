import React from "react";
import Input from "../input";

export default function TypeSize({ field }) {
  const { field: size } = field;
  const { height = "auto", width = "auto", "@title": title } = size;

  return (
    <div className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <div className="flex gap-1">
        <Input value={width} />
        <Input value={height} />
      </div>
    </div>
  );
}
