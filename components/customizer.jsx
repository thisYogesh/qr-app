import React from "react";
import SvgBlock from "../svg/block";

import Media from "./media";
import useStoreConfig from "../hooks/useStoreConfig";
import CustomizeTrigger from "./customize-trigger";
import Settings from "./settings";

export default function Customizer({ children }) {
  const { current: storeConfig } = useStoreConfig();

  return storeConfig ? (
    <div className="main-admin-layout grid h-screen">
      <aside className="flex flex-col border-r border-r-gray-200 bg-white">
        <div className="flex flex-col p-4 font-bold border-b border-b-gray-200">
          QR App{" "}
          <span className="text-sm font-medium">(https://qr.manyog.in)</span>
        </div>
        <div className="funtional-block p-4 ">
          <div className="font-medium mb-1">Settings</div>

          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1 text-sm items-center">
              <span className="svg flex w-4 h-4">
                <SvgBlock />
              </span>
              Logo
            </div>
            <div className="flex gap-1 text-sm items-center">
              <span className="svg flex w-4 h-4">
                <SvgBlock />
              </span>
              Backrgound
            </div>
            <div className="flex gap-1 text-sm items-center">
              <span className="svg flex w-4 h-4">
                <SvgBlock />
              </span>
              Backrgound
            </div>
          </div>
        </div>
        <div className="funtional-block p-4">
          <span className="font-medium">Settings 2</span>

          <div className="flex flex-col gap-1">
            <div className="text-sm">Logo</div>
            <div className="text-sm">Favicon</div>
          </div>
        </div>
      </aside>
      <div className="flex justify-center p-4 ">
        <div className="app-builder flex-grow overflow-hidden">
          <div data-customizer className="flex flex-col gap-0.5 w-full h-full">
            <CustomizeTrigger data={storeConfig?.metadata}>
              {({ ref, events }) => (
                <div
                  ref={ref}
                  {...events}
                  className="flex items-center gap-1 p-1"
                >
                  <div className="w-5">
                    <Media data={storeConfig?.metadata?.favicon} />
                  </div>
                  <span className="text-[13px]">
                    {storeConfig.metadata.title.value}
                  </span>
                </div>
              )}
            </CustomizeTrigger>

            <div className="flex flex-col gap-2 w-full bg-white rounded-lg overflow-hidden border border-gray-200 h-full">
              {children}
            </div>
          </div>
        </div>
      </div>

      <Settings />
    </div>
  ) : null;
}
