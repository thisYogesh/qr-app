import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewConfig } from "../states/app";

export default function AddNewConfig({ config }) {
  const dispatch = useDispatch();
  const [selectedValue, setSelected] = useState();

  const onChange = value => {
    setSelected(value);

    const { [value]: newConfig, newConfigMeta } = config;
    dispatch(addNewConfig({ newConfig, newConfigMeta }));
  };

  return (
    <div>
      <h4 className="pb-2 text-sm font-medium">Select Type Of Button</h4>
      <div data-config-form className="flex flex-col gap-2">
        {config.options.map((option, index) => (
          <label
            key={index}
            className="flex items-center border border-gray-200 rounded-md px-2 py-3 gap-2"
          >
            <input
              type="radio"
              value={option.value}
              name="option"
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="--title text-sm text-gray-800">
              {option.title}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
