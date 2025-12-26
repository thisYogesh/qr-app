import React from "react";
import { startCase } from "lodash";

// All controls
import TypeWrapper from "./wrapper";
import TypeText from "./text";
import TypeImage from "./image";
import TypeSize from "./size";
import TypeValue from "./value";
import TypeColor from "./color";
import TypeOpacity from "./opacity";
import TypeAnchor from "./anchor";

const CONTROLS = {
  TypeWrapper,
  TypeText,
  TypeImage,
  TypeSize,
  TypeValue,
  TypeColor,
  TypeOpacity,
  TypeAnchor
};

export default function ControlRenderer({ field }) {
  const { field: currentField } = field;
  const type = currentField["@type"];
  const control = `Type${startCase(type)}`;
  const { [control]: Control } = CONTROLS;

  if (!Control) console.log("Unknown type found!", control);

  return (
    <>
      {Control ? (
        <Control data-control={control} field={field} key={Math.random()} />
      ) : null}
    </>
  );
}
