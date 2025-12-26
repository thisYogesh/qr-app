import React, { useState } from "react";
import Input from "../input";

export default function TypeSize({ field, ...props }) {
  const { field: _size } = field;
  const { height = "auto", width = "auto", "@title": title } = _size;

  const [size, setSize] = useState({ width, height });

  return (
    <div {...props} className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <div className="flex gap-1">
        <Input
          label="Width"
          value={size.width}
          onInput={e => setSize(prev => ({ ...prev, width: e.target.value }))}
        />
        <Input
          label="Height"
          value={size.height}
          onInput={e => setSize(prev => ({ ...prev, height: e.target.value }))}
        />
      </div>
    </div>
  );
}
