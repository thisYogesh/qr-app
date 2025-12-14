import React, { useContext } from "react";
import useStoreConfig from "../hooks/useStoreConfig";
import { IfElse } from "../helpers";
import AppBg from "./app-background";
import Media from "./media";
import { AppContext } from "../src/app-context";
import CustomizeTrigger from "./customize-trigger";
import SlideContainer from "./actions_templates/slide-container";

export default () => {
  const { state } = useContext(AppContext);
  const { current: storeConfig } = useStoreConfig();

  return IfElse(storeConfig, () => (
    <div data-app className="h-full w-full">
      <CustomizeTrigger data={storeConfig?.backrgound}>
        {({ ref, events }) => (
          <div
            {...events}
            ref={ref}
            className="relative flex flex-col w-full justify-between h-full gap-8 z-10 px-3"
          >
            {IfElse(storeConfig?.backrgound, () => (
              <AppBg data={storeConfig?.backrgound} />
            ))}

            <header className="flex justify-center items-center pt-8">
              <CustomizeTrigger data={storeConfig?.logo}>
                {({ ref, events }) => (
                  <div ref={ref} {...events}>
                    <Media data={storeConfig?.logo} />
                  </div>
                )}
              </CustomizeTrigger>
            </header>
            <main className="flex flex-col items-center justify-center">
              <div
                data-main
                className="flex w-full flex-col items-center justify-center"
              >
                <SlideContainer storeConfig={storeConfig} />

                {storeConfig?.Bottomline.value ? (
                  <CustomizeTrigger data={storeConfig?.Bottomline}>
                    {({ ref, events }) => (
                      <div
                        {...events}
                        ref={ref}
                        className="relative bg-white font-bold mt-8 px-2 py-1 rounded-md shadow text-blue-900 text-center text-sm"
                      >
                        <a>{storeConfig?.Bottomline.value}</a>
                      </div>
                    )}
                  </CustomizeTrigger>
                ) : (
                  <CustomizeTrigger data={storeConfig?.Bottomline}>
                    {({ ref, events }) => (
                      <div {...events} ref={ref} className="min-w-42 mt-8">
                        <place-holder className="px-2">
                          <span data-info className="z-10 py-1 px-1">
                            Add Text
                          </span>
                        </place-holder>
                      </div>
                    )}
                  </CustomizeTrigger>
                )}
              </div>
            </main>
            <footer className="pb-4">
              {IfElse(
                storeConfig?.Copyright?.value,
                <CustomizeTrigger data={storeConfig?.Copyright}>
                  {({ ref, events }) => (
                    <p
                      ref={ref}
                      {...events}
                      className="text-center text-gray-600"
                    >
                      {storeConfig?.Copyright?.value}
                    </p>
                  )}
                </CustomizeTrigger>,
                <CustomizeTrigger data={storeConfig?.Copyright}>
                  {({ ref, events }) => (
                    <div ref={ref} {...events}>
                      <place-holder>
                        <span data-info className="z-10 py-1 px-1">
                          Add Text
                        </span>
                      </place-holder>
                    </div>
                  )}
                </CustomizeTrigger>
              )}
            </footer>
          </div>
        )}
      </CustomizeTrigger>
    </div>
  ));
};
