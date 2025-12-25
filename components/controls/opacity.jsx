import React, { useState } from "react";
import Input from "../input";

export default function TypeOpacity({ field }) {
  const { field: opacity } = field;
  const { _value, "@title": title } = opacity;
  const [value, setValue] = useState(_value);

  return (
    <div className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <Input
        type="range"
        onInput={e => setValue(e.target.value)}
        value={value}
        min="0"
        max="10"
      />
    </div>
  );
}
