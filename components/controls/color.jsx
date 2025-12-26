import React, { useState } from "react";
import Input from "../input";

export default function TypeColor({ field, ...props }) {
  const { field: color } = field;
  const { value: _value, "@title": title } = color;
  const [value, setValue] = useState(_value);

  return (
    <div {...props} className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <Input
        type="color"
        onInput={e => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
}
