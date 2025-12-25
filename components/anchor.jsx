import React from "react";

export default function Anchor({ data }) {
  const { text, href } = data;

  return (
    <span className="underline">
      <a href={`${href}`}>{text}</a>
    </span>
  );
}
