import React from "react";

export default function Input({ id, label, type = "text", ...props }) {
  return (
    <div className="input flex flex-col gap-0.5 w-full">
      {label ? (
        <label
          for={id}
          className="input__label capitalize text-gray-700 font-semibold text-xs"
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className="text-sm h-8"
        type={type}
        value={props.value}
        placeholder={props.placeholder}
      />
    </div>
  );
}
