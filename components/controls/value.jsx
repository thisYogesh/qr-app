import React from "react";
import Input from "../input";

export default function TypeValue({ field }) {
  const { field: _value } = field;
  const { "@title": title, value } = _value;

  return (
    <div className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <div className="flex gap-1">
        <Input value={value} />
      </div>
    </div>
  );
}
