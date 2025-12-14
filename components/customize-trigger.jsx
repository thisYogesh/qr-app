import React, { useContext, useEffect, useRef } from "react";
import { AppContext, RENDER_MODE } from "../src/app-context";
import { getSettings } from "../src/helpers";
import { useDispatch } from "react-redux";
import { setSettings } from "../states/app";

const $highlighters = [];
export default function CustomizeTrigger({ data, isNew = false, children }) {
  const dispatch = useDispatch();
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

    const settings = getSettings([data]);
    dispatch(setSettings(settings?.[0]));
  };

  const customizerEvents =
    state.renderMode === RENDER_MODE.CUSTOMIZER ? { onMouseOver, onClick } : {};

  const EventDot = ({ ...props }) =>
    state.renderMode === RENDER_MODE.CUSTOMIZER ? (
      <span
        {...props}
        className="event-trigger absolute w-[10px] h-[10px] bg-blue-500 rounded-full mr-5 right-0"
      ></span>
    ) : null;

  return children?.({ ref: $elRef, events: customizerEvents, EventDot });
}
