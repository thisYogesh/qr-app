import React, { useContext, useEffect, useRef } from "react";
import CustomizeTrigger from "../customize-trigger";
import RenderActionTemplate from "./render";
import { IfElse } from "../../helpers";
import { AppContext, RENDER_MODE } from "../../src/app-context";
import Media from "../media";

const layoutReflow = new Event("@layout-reflow");
export default function SlideContainer({ storeConfig }) {
  const { state } = useContext(AppContext);
  const $contentContainer = useRef(null);
  const $slideContainer = useRef(null);
  const $slideBack = useRef([]);

  useEffect(() => {
    const $els = $slideBack?.current;
    $els.forEach($el => $el?.addEventListener("click", goBack));

    return () => $els.forEach($el => $el?.removeEventListener("click", goBack));
  }, [$slideBack?.current]);

  const goBack = e => {
    e.stopPropagation();

    const { current: $slideContainerEl } = $slideContainer;
    $slideContainerEl.style.removeProperty("--dynamic-height");
    $slideContainerEl.classList.remove("-translate-x-full");

    window.dispatchEvent(layoutReflow);
  };

  const slideTo = contentId => {
    const [{ current: $contentContainerEl }, { current: $slideContainerEl }] = [
      $contentContainer,
      $slideContainer
    ];

    // hide all content
    $contentContainerEl
      .querySelectorAll(".content-block")
      .forEach($el => $el.classList.add("hidden"));

    // show relevent content
    const $content = $contentContainerEl.querySelector(contentId);
    $content.classList.remove("hidden");
    const { height: contentHeight } = $content.getBoundingClientRect();

    // start transition
    $slideContainerEl.classList.add("-translate-x-full");
    $slideContainerEl.style.setProperty(
      "--dynamic-height",
      `${contentHeight}px`
    );
  };

  const slideToContent = (e, index) => {
    e.stopPropagation();
    slideTo(`#template-${index}`);

    window.dispatchEvent(layoutReflow);
  };

  const handleActionButtonClick = (e, defaultClick, customiserClick) => {
    if (state.renderMode === RENDER_MODE.CUSTOMIZER) return customiserClick(e);

    defaultClick();
  };

  return (
    <CustomizeTrigger
      name="slide-container"
      data={storeConfig?.action_background}
    >
      {({ ref, events }) => (
        <div
          {...events}
          ref={ref}
          className="flex items-center justify-center bg-white border border-gray-300 rounded-lg transition-border shadow-md overflow-hidden w-full"
        >
          <div
            ref={$slideContainer}
            className="flex bg-white items-center duration-300 transform transition-all flex-grow max-w-full"
          >
            <ul
              data-trigger-container
              className="p-6 md:p-8 trigger flex flex-col w-full flex-shrink-0 gap-4"
            >
              {storeConfig?.actions?.map((action, index) => (
                <li key={index}>
                  <CustomizeTrigger name="action-button" data={action.button}>
                    {({ ref, events, EventDot }) => (
                      <a
                        ref={ref}
                        onMouseOver={events?.onMouseOver}
                        onClick={e =>
                          handleActionButtonClick(
                            e,
                            () => slideTo(`#template-${index}`),
                            events.onClick
                          )
                        }
                        data-trigger={
                          action?.template ? `#template-${index}` : ""
                        }
                        href={
                          action.button.href ? action.button.href : undefined
                        }
                        target={action.button.href ? "_blank" : undefined}
                        style={{
                          "--bg-color":
                            action.button.background_color.bg_color || "#000",
                          "--text-color":
                            action.button.background_color.text_color || "#fff"
                        }}
                        className="relative app-button w-full py-3 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-transform transform hover:scale-105"
                      >
                        {IfElse(action.button.icon, () => (
                          <span className="flex h-5 w-5">
                            <Media data={action.button.icon} />
                          </span>
                        ))}
                        {action.button.title.value}

                        <EventDot onClick={e => slideToContent(e, index)} />
                      </a>
                    )}
                  </CustomizeTrigger>
                </li>
              ))}

              {IfElse(state?.renderMode !== RENDER_MODE.NORMAL, () => (
                <li>
                  <CustomizeTrigger isNew data={storeConfig?.["actions.new"]}>
                    {({ ref, events }) => (
                      <div
                        ref={ref}
                        {...events}
                        data-customize-trigger="actions.new"
                      >
                        <place-holder className="px-2 py-1 rounded-3xl">
                          <span data-info className="z-10 py-1 px-1">
                            + Add Button
                          </span>
                        </place-holder>
                      </div>
                    )}
                  </CustomizeTrigger>
                </li>
              ))}
            </ul>

            <div
              ref={$contentContainer}
              id="content"
              className="relative w-full flex-shrink-0"
            >
              {storeConfig?.actions?.map((action, index) =>
                action.template ? (
                  <div
                    key={index}
                    id={`template-${index}`}
                    className="flex flex-col gap-4 p-6 md:p-8 hidden w-full content-block bg-white"
                  >
                    <div className="flex items-center">
                      <button
                        ref={$el => $slideBack.current.push($el)}
                        className="flex justify-center items-center w-8 h-8 rounded-full bg-blue-900 text-white"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <use href="./svg-sprites.svg#back-arrow" />
                        </svg>
                      </button>

                      <span className="ml-2">{action.button.title.value}</span>
                    </div>
                    <RenderActionTemplate
                      data={action}
                      template={action.template}
                    />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </CustomizeTrigger>
  );
}
