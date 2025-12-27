import React from "react";
import { useSelector } from "react-redux";

export default function AddNewConfig({ config }) {
  return (
    <div>
      <h4 className="pb-2 text-sm font-medium">Select Type Of Button</h4>
      <div data-config-form className="flex flex-col gap-2">
        {config.options.map((option, index) => (
          <label
            key={index}
            className="flex items-center border border-gray-200 rounded-md px-2 py-3 gap-2"
          >
            <input type="radio" value={option.value} name="option" />
            <span className="text-sm text-gray-800">{option.title}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
