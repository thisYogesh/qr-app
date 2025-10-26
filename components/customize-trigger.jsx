import React, { cloneElement, useContext, useEffect, useRef } from "react";
import { AppContext, RENDER_MODE } from "../src/app-context";

const $highlighters = [];
export default function CustomizeTrigger({ data, children }) {
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

  useEffect(() => {
    const { current: $el } = $elRef;

    $el?.addEventListener("mouseover", onMouseOver);
    $el?.addEventListener("click", onClick);

    return () => {
      $el?.removeEventListener("mouseover", onMouseOver);
      $el?.removeEventListener("click", onClick);
    };
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

  return state.renderMode !== RENDER_MODE.CUSTOMIZER
    ? children
    : cloneElement(children, {
        ref: $elRef
      });
}
