import React, { cloneElement, useContext, useEffect, useRef } from "react";
import { AppContext, RENDER_MODE } from "../src/app-context";

const $highlighters = [];
export default function CustomizeTrigger({ data, isNew = false, children }) {
  const { state } = useContext(AppContext);
  const $elRef = useRef(null);
  const $highlighterRef = useRef(null);

  useEffect(() => {
    // If app isn't render under customiser, then don't create $highlighter element
    if (state.renderMode !== RENDER_MODE.CUSTOMIZER) return;

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
    $highlighters.push($highlighter);
    $highlighterRef.current = $highlighter;

    return () => {
      $highlighter.remove();

      const $aliveEls = $highlighters.filter($el => $el.isConnected);
      $highlighters.push(...$aliveEls);
    };
  }, []);

  const onMouseOver = e => {
    e.stopPropagation();

    const { current: $el } = $elRef;
    const { current: $highlighter } = $highlighterRef;
    const { style, classList } = $highlighter;
    const { height, width, left, top } = $el.getBoundingClientRect();

    $highlighters.forEach($el => $el.classList.add("hidden"));

    style.setProperty("height", height + "px");
    style.setProperty("width", width + "px");
    style.setProperty("left", left + "px");
    style.setProperty("top", top + "px");
    classList.remove("hidden");
  };

  // TODO: Write a logic to show settings
  const onClick = e => {
    e.stopPropagation();
    console.log(data, isNew);
  };

  const customizerEvents =
    state.renderMode === RENDER_MODE.CUSTOMIZER
      ? { onMouseOver: onMouseOver, onClick: onClick }
      : null;

  return cloneElement(children, {
    ref: $elRef,
    ...customizerEvents
  });
}
