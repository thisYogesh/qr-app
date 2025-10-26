import React, { useContext, useRef } from "react";
import ActionButton from "../action-button";
import CustomizeTrigger from "../customize-trigger";
import RenderActionTemplate from "./render";
import { IfElse } from "../../helpers";
import { AppContext, RENDER_MODE } from "../../src/app-context";

export default function SlideContainer({ storeConfig }) {
  const { state } = useContext(AppContext);
  const $contentContainer = useRef(null);
  const $slideContainer = useRef(null);

  const slideTo = contentId => {
    const [{ cureent: $contentContainer }, { current: $slideContainer }] = [
      $contentContainer,
      $slideContainer
    ];

    // hide all content
    $contentContainer
      .querySelectorAll(".content-block")
      .forEach($el => $el.classList.add("hidden"));

    // show relevent content
    const $content = $contentContainer.querySelector(contentId);
    $content.classList.remove("hidden");
    const { height: contentHeight } = $content.getBoundingClientRect();

    // start transition
    $slideContainer.classList.add("-translate-x-full");
    $slideContainer.style.setProperty("--dynamic-height", `${contentHeight}px`);
  };

  return (
    <CustomizeTrigger data={storeConfig?.action_background}>
      <div className="flex items-center justify-center bg-white border border-gray-300 rounded-lg transition-border shadow-md overflow-hidden w-full">
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
                <CustomizeTrigger data={action.button}>
                  <ActionButton data={action} index={index} />
                </CustomizeTrigger>
              </li>
            ))}

            {IfElse(state?.renderMode !== RENDER_MODE.NORMAL, () => (
              <li>
                <div data-customize-trigger="actions.new">
                  <place-holder className="px-2 py-1 rounded-3xl">
                    <span data-info className="z-10 py-1 px-1">
                      + Add Button
                    </span>
                  </place-holder>
                </div>
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
                      data-back
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

                    <span className="ml-2">{action.button.label}</span>
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
    </CustomizeTrigger>
  );
}
