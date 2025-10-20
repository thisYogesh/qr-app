import React, { cloneElement, useEffect, useRef } from "react";

export default function CustomizeTrigger({ children }) {
  const $elRef = useRef(null);
  const $highlighterRef = useRef(null);

  useEffect(() => {
    const $highlighter = document.createElement("a");
    const { classList } = $highlighter;
    classList.add(
      "highlighter",
      "hidden",
      "flex",
      "justify-end",
      "items-center",
      "pointer-events-none"
    );

    document.body.append($highlighter);
    $highlighterRef.current = $highlighter;

    return () => $highlighter.remove();
  }, []);

  const onMouseOver = e => {
    e.stopPropagation();

    const { current: $el } = $elRef;
    const { current: $highlighter } = $highlighterRef;
    const { style, classList } = $highlighter;
    const { height, width, left, top } = $el.getBoundingClientRect();

    style.setProperty("height", height + "px");
    style.setProperty("width", width + "px");
    style.setProperty("left", left + "px");
    style.setProperty("top", top + "px");
    classList.remove("hidden");
  };

  return cloneElement(children, {
    ref: $elRef,
    onMouseOver: onMouseOver
  });
}
