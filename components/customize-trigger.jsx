import React, { cloneElement, useContext, useEffect, useRef } from "react";
import { AppContext } from "../src/app-context";

const $highlighters = [];
export default function CustomizeTrigger({ data, children }) {
  const { setContext } = useContext(AppContext);
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
    $highlighters.push($highlighter);
    $highlighterRef.current = $highlighter;

    return () => {
      $highlighter.remove();

      const $aliveEls = $highlighters.filter($el => $el.isConnected);
      $highlighters.push(...$aliveEls);
    };
  }, []);

  useEffect(() => {
    const { current: $el } = $elRef;
    $el?.addEventListener("mouseover", onMouseOver);

    return () => $el?.removeEventListener("mouseover", onMouseOver);
  }, [$elRef?.current]);

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

  const onClick = e => {
    e.stopPropagation();
    console.log(data);
  };

  return cloneElement(children, {
    ref: $elRef,
    onClick: onClick
    // onMouseOut: onMouseOut
  });
}
