import React, { useEffect, useState } from "react";
import Input from "../input";
import { useDispatch } from "react-redux";
import { updatePath } from "../../states/app";

export default function TypeValue({ field, ...props }) {
  const dispatch = useDispatch();
  const { field: _value } = field;
  const { "@title": title, value: val, __path } = _value;
  const [value, setValue] = useState(val);

  useEffect(() => {
    const updateData = { __path, value: { ..._value, value: value } };
    dispatch(updatePath(updateData));
  }, [value]);

  return (
    <div {...props} className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <div className="flex gap-1">
        <Input value={value} onInput={e => setValue(e.target.value)} />
      </div>
    </div>
  );
}
