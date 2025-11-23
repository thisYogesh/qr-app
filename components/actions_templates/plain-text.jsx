import React from "react";
import CustomizeTrigger from "../customize-trigger";

export default function PlainText({ data }) {
  const { content } = data;
  return (
    <CustomizeTrigger data={content}>
      {({ ref, events }) => (
        <div {...events} ref={ref}>
          {content.value}
        </div>
      )}
    </CustomizeTrigger>
  );
}
