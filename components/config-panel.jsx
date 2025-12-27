import React, { useEffect } from "react";
import SvgSettings from "../svg/settings";
import { useDispatch, useSelector } from "react-redux";
import ControlRenderer from "./controls/render";
import { setNewConfig, setSettings } from "../states/app";
import AddNewConfig from "./add-new-config";

export default function ConfigurationPanel() {
  const dispatch = useDispatch();
  const currentSettings = useSelector(state => state.app.currentSettings);
  const currentNewConfig = useSelector(state => state.app.currentNewConfig);

  useEffect(() => {
    window.addEventListener("@layout-reflow", () => {
      dispatch(setSettings(null));
      dispatch(setNewConfig(null));
    });
  }, []);

  return (
    <aside
      data-settings-viewer
      className="flex flex-col justify-between border-l border-l-gray-200 bg-white p-4"
    >
      <div data-settings>
        {currentSettings ? <ControlRenderer field={currentSettings} /> : null}
        {currentNewConfig ? <AddNewConfig config={currentNewConfig} /> : null}
      </div>

      {!currentSettings && !currentNewConfig ? (
        <div className="flex flex-col items-center text-sm text-center p-5 h-full justify-center">
          <div className="svg w-1/2 opacity-10">
            <SvgSettings />
          </div>

          <span className="text-gray-400">
            Please select a block to continue
          </span>
        </div>
      ) : null}

      <div className="action-buttons flex gap-2">
        <button disabled className="button basis-0 grow disabled:opacity-40">
          Save
        </button>
        <button disabled className="button basis-0 grow disabled:opacity-40">
          Cancel
        </button>
      </div>
    </aside>
  );
}
