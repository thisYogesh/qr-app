import React, { useEffect, useState } from "react";
import Input from "../input";
import { updateStoreConfig } from "../../states/app";
import { useDispatch } from "react-redux";

export default function TypeColor({ field, ...props }) {
  const dispatch = useDispatch();
  const { field: color } = field;
  const { value: _value, "@title": title, __path } = color;
  const [value, setValue] = useState(_value);

  useEffect(() => {
    const updateData = { __path, value: { ...color, value: value } };
    console.log(updateData);
    dispatch(updateStoreConfig(updateData));
  }, [value]);

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
