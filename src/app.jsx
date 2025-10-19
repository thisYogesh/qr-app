import React, { useEffect } from "react";
import useStoreConfig from "../hooks/useStoreConfig";
import { IfElse } from "../helpers";
import AppBg from "../components/app-background";
import Media from "../components/media";
import ActionButton from "../components/action-button";

export default () => {
  const { current: storeConfig } = useStoreConfig();

  return IfElse(storeConfig, () => (
    <div data-app className="h-full">
      <div
        data-customize-trigger="backrgound"
        className="relative flex flex-col w-full justify-between h-full gap-8 z-10 px-3"
      >
        {IfElse(storeConfig?.backrgound, () => (
          <AppBg data={storeConfig?.backrgound} />
        ))}

        <header className="flex justify-center items-center pt-8">
          <div data-customize-trigger="logo">
            <Media data={storeConfig?.logo} />
          </div>
        </header>
        <main className="flex flex-col items-center justify-center">
          <div
            data-main
            className="flex w-full flex-col items-center justify-center"
          >
            <div
              data-customize-trigger="action_background"
              className="flex items-center justify-center bg-white border border-gray-300 rounded-lg transition-border shadow-md overflow-hidden w-full"
            >
              <div
                data-slide-container
                className="flex bg-white items-center duration-300 transform transition-all flex-grow max-w-full"
              >
                <ul
                  data-trigger-container
                  className="p-6 md:p-8 trigger flex flex-col w-full flex-shrink-0 gap-4"
                >
                  {storeConfig?.actions?.map((action, index) => (
                    <li key={index}>
                      <ActionButton data={action} index={index} />
                    </li>
                  ))}
                  <li>
                    <div data-customize-trigger="actions.new">
                      <place-holder className="px-2 py-1 rounded-3xl">
                        <span data-info className="z-10 py-1 px-1">
                          + Add Button
                        </span>
                      </place-holder>
                    </div>
                  </li>
                </ul>

                <div
                  data-content-container
                  id="content"
                  className="relative w-full flex-shrink-0"
                >
                  {storeConfig?.actions?.map((action, index) =>
                    IfElse(
                      action.template,
                      <div
                        key={index}
                        id="template-{{@index}}"
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

                          <span className="ml-2"> {action.button.label} </span>
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
                className="relative bg-white font-bold mt-8 px-2 py-1 rounded-md shadow text-blue-900 text-center text-sm"
              >
                <a>{storeConfig?.Bottomline.value}</a>
              </div>,
              <div
                data-customize-trigger="Bottomline"
                className="min-w-42 mt-8"
              >
                <place-holder className="px-2">
                  <span data-info className="z-10 py-1 px-1">
                    Add Text
                  </span>
                </place-holder>
              </div>
            )}
          </div>
        </main>
        <footer className="pb-4">
          {IfElse(
            storeConfig?.Copyright?.value,
            <p
              data-customize-trigger="Copyright"
              className="text-center text-gray-600"
            >
              {storeConfig?.Copyright?.value}
            </p>,
            <div data-customize-trigger="Copyright">
              <place-holder>
                <span data-info className="z-10 py-1 px-1">
                  Add Text
                </span>
              </place-holder>
            </div>
          )}
        </footer>
      </div>
    </div>
  ));
};
