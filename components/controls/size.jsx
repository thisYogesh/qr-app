import React, { useEffect, useState } from "react";
import Input from "../input";
import { useDispatch } from "react-redux";
import { updatePath } from "../../states/app";

export default function TypeSize({ field, ...props }) {
  const dispatch = useDispatch();
  const { field: _size } = field;
  const { height = "", width = "", "@title": title, __path } = _size;
  const [size, setSize] = useState({ width, height });

  useEffect(() => {
    const updateData = { __path, value: { ..._size, ...size } };
    dispatch(updatePath(updateData));
  }, [size]);

  return (
    <div {...props} className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>
      <div className="flex gap-1">
        <Input
          type="number"
          label="Width"
          value={size.width}
          onInput={e => setSize(prev => ({ ...prev, width: e.target.value }))}
          placeholder="auto"
          postfix="px"
        />
        <Input
          type="number"
          label="Height"
          value={size.height}
          onInput={e => setSize(prev => ({ ...prev, height: e.target.value }))}
          placeholder="auto"
          postfix="px"
        />
      </div>
    </div>
  );
}
