import React, { useState } from "react";
import Input from "../input";

export default function TypeValue({ field, ...props }) {
  const { field: _value } = field;
  const { "@title": title, value: val } = _value;
  const [value, setValue] = useState(val);

  return (
    <div {...props} className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <div className="flex gap-1">
        <Input value={value} onInput={e => setValue(e.target.value)} />
      </div>
    </div>
  );
}
