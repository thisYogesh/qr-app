import React, { useContext, useEffect, useRef, useState, useId } from "react";
import { AppContext, RENDER_MODE } from "../src/app-context";
import { getSettings } from "../src/helpers";
import { useDispatch } from "react-redux";
import { setNewConfig, setSettings } from "../states/app";

const $highlighters = [];
let selectedConfigId = "";
let layoutInReflow = false;

const unSelectConfig = () => {
  const $visibleHighlighters = $highlighters.filter(
    $el => $el.checkVisibility() || $el.classList.contains("--selected")
  );

  $visibleHighlighters.forEach($el => {
    $el.classList.add("hidden");
    $el.classList.remove("--selected");
  });
};

const onLayoutReflow = () => {
  if (layoutInReflow) return;

  selectedConfigId = "";
  unSelectConfig();
  layoutInReflow = true;

  setTimeout(() => (layoutInReflow = false), 500);
};

export default function CustomizeTrigger({ data, isNew = false, children }) {
  const dispatch = useDispatch();
  const { state } = useContext(AppContext);
  const $elRef = useRef(null);
  const $highlighterRef = useRef(null);
  const cid = useId();

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

    window.addEventListener("@layout-reflow", onLayoutReflow);

    return () => {
      $highlighter.remove();
      window.removeEventListener("@layout-reflow", onLayoutReflow);

      const $aliveEls = $highlighters.filter($el => $el.isConnected);
      $highlighters.push(...$aliveEls);
    };
  }, []);

  const onMouseOver = e => {
    e.stopPropagation();
    if (layoutInReflow) return;

    const { current: $el } = $elRef;
    const { current: $highlighter } = $highlighterRef;
    const { style, classList } = $highlighter;
    const { height, width, left, top } = $el.getBoundingClientRect();

    $highlighters
      .filter($el => !$el.classList.contains("--selected"))
      .forEach($el => $el.classList.add("hidden"));

    style.setProperty("height", height + "px");
    style.setProperty("width", width + "px");
    style.setProperty("left", left + "px");
    style.setProperty("top", top + "px");
    classList.remove("hidden");
  };

  // Here we show all settings related to type
  const onClick = e => {
    e.stopPropagation();
    if (layoutInReflow) return;
    if (selectedConfigId === cid) return;

    unSelectConfig();

    const { current: $highlighter } = $highlighterRef;
    $highlighter.classList.add("--selected");
    $highlighter.classList.remove("hidden");

    if (!isNew) {
      const settings = getSettings([data]);
      dispatch(setSettings(settings?.[0]));
      dispatch(setNewConfig(null));
    } else {
      // Continue here
      dispatch(setSettings(null));
      dispatch(setNewConfig(data));

      console.log(data);
    }

    selectedConfigId = cid;
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
