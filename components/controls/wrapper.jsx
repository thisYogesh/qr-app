import React from "react";
import ControlRenderer from "./render";

export default function TypeWrapper({ field }) {
  const { field: wrapper, fields } = field;
  const { "@title": title } = wrapper;

  const renderControls = () => {
    return (
      <>
        {fields.map((field, index) => (
          <ControlRenderer key={index} field={field} />
        ))}
      </>
    );
  };
  return (
    <div className="flex flex-col gap-1">
      <h4 className="capitalize text-sm font-medium">{title}</h4>
      {fields?.length > 0 ? renderControls() : null}
    </div>
  );
}
