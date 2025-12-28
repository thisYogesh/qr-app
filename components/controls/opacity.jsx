import React, { useEffect, useState } from "react";
import Input from "../input";
import { updatePath } from "../../states/app";
import { useDispatch } from "react-redux";

export default function TypeOpacity({ field, ...props }) {
  const dispatch = useDispatch();
  const { field: opacity } = field;
  const { value: _value, "@title": title, __path } = opacity;
  const [value, setValue] = useState(_value);

  useEffect(() => {
    const updateData = { __path, value: { ...opacity, value: value } };
    dispatch(updatePath(updateData));
  }, [value]);

  return (
    <div {...props} className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <Input
        type="range"
        onInput={e => setValue(e.target.value)}
        value={value}
        min="0"
        step="0.01"
        max="1"
      />
    </div>
  );
}
