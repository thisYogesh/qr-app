import React from "react";
import Input from "../input";

export default function TypeValue({ field }) {
  const { field: _value } = field;
  const { "@title": title, value } = _value;

  return <Input value={value} label={title} />;
}
