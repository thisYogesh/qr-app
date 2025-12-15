import React from "react";
import Input from "../input";

export default function TypeColor({ field }) {
  const { field: color } = field;
  const { value, "@title": title } = color;

  return (
    <div className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <Input type="color" value={value} />
    </div>
  );
}
