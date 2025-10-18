import React, { useEffect } from "react";
import useStoreConfig from "../hooks/useStoreConfig";
import { IfElse } from "../helpers";

export default () => {
  const { current: storeConfig } = useStoreConfig();

  return (
    <div data-main class="flex w-full flex-col items-center justify-center">
      <div
        data-customize-trigger="action_background"
        class="flex items-center justify-center bg-white border border-gray-300 rounded-lg transition-border shadow-md overflow-hidden w-full"
      >
        <div
          data-slide-container
          class="flex bg-white items-center duration-300 transform transition-all flex-grow max-w-full"
        >
          <ul
            data-trigger-container
            class="p-6 md:p-8 trigger flex flex-col w-full flex-shrink-0 gap-4"
          >
            {storeConfig?.actions?.map(action => (
              <li>{/* {{#app_button this @index}}{{/app_button}} */}</li>
            ))}
            <li>
              <div data-customize-trigger="actions.new">
                <place-holder class="px-2 py-1 rounded-3xl">
                  <span data-info class="z-10 py-1 px-1">
                    + Add Button
                  </span>
                </place-holder>
              </div>
            </li>
          </ul>

          <div
            data-content-container
            id="content"
            class="relative w-full flex-shrink-0"
          >
            {storeConfig?.actions?.map(action =>
              IfElse(
                action.template,
                <div
                  id="template-{{@index}}"
                  class="flex flex-col gap-4 p-6 md:p-8 hidden w-full content-block bg-white"
                >
                  <div class="flex items-center">
                    <button
                      data-back
                      class="flex justify-center items-center w-8 h-8 rounded-full bg-blue-900 text-white"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        class="h-5 w-5"
                        aria-hidden="true"
                      >
                        <use href="./svg-sprites.svg#back-arrow" />
                      </svg>
                    </button>

                    <span class="ml-2"> {action.button.label} </span>
                  </div>
                  {/* {{> (dynamic_template)}} */}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {IfElse(
        storeConfig?.Bottomline.value,
        <div
          data-customize-trigger="Bottomline"
          class="relative bg-white font-bold mt-8 px-2 py-1 rounded-md shadow text-blue-900 text-center text-sm"
        >
          <a>{storeConfig?.Bottomline.value}</a>
        </div>,
        <div data-customize-trigger="Bottomline" class="min-w-42 mt-8">
          <place-holder class="px-2">
            <span data-info class="z-10 py-1 px-1">
              Add Text
            </span>
          </place-holder>
        </div>
      )}
    </div>
  );
};
