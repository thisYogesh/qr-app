import React from "react";
import { CONFIG_TYPE } from "../../src/enum";
import Anchor from "../anchor";
import CustomizeTrigger from "../customize-trigger";
import Media from "../media";
import useStoreConfig from "../../hooks/useStoreConfig";

export default function TwoColumn({ data }) {
  const { items } = data;
  const { current: storeConfig } = useStoreConfig();

  return (
    <div className="flex flex-col gap-2">
      {items.map((row, index) => (
        <CustomizeTrigger data={row} key={index}>
          {({ ref, events }) => (
            <div
              key={index}
              ref={ref}
              {...events}
              className="flex text-sm items-start gap-1 text-blue-900 font-medium"
            >
              <span className="flex bg-yellow-400 text-blue-900 h-7 w-7 p-1.5 rounded-full flex-shrink-0">
                <Media data={row.icon} />
              </span>

              {row.content["@type"] === CONFIG_TYPE.ANCHOR ? (
                <Anchor data={row.content} />
              ) : (
                <p>{row.content.value}</p>
              )}
            </div>
          )}
        </CustomizeTrigger>
      ))}

      <CustomizeTrigger isNew data={storeConfig?.["actions.items.new"]}>
        {({ ref, events }) => (
          <div ref={ref} {...events}>
            <place-holder className="py-1 rounded-sm">
              <span data-info className="z-10 px-1">
                + Add Row
              </span>
            </place-holder>
          </div>
        )}
      </CustomizeTrigger>
    </div>
  );
}
