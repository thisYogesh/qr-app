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

const CONTROLS = {
  TypeWrapper,
  TypeText,
  TypeImage,
  TypeSize,
  TypeValue,
  TypeColor,
  TypeOpacity
};

export default function ControlRenderer({ field }) {
  const { field: currentField } = field;
  const type = currentField["@type"];
  const control = `Type${startCase(type)}`;
  const { [control]: Control } = CONTROLS;

  if (!Control) console.log("Unknown type found!", control);

  return <>{Control ? <Control field={field} /> : null}</>;
}
