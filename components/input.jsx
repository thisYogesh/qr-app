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
      <div className="relative flex">
        <input id={id} className="text-sm w-full" type={type} {...props} />
        {props?.postfix ? (
          <div className="flex absolute right-0 top-0 h-full p-1">
            <span className="flex justify-center items-center bg-gray-200 px-2 rounded-md text-xs">
              {props.postfix}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
