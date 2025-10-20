import React from "react";
import { createRoot } from "react-dom/client";
import Main from "./main";
import { RENDER_MODE } from "./app-context";

const $app = document.querySelector("#app");

const root = createRoot($app);
root.render(<Main renderMode={RENDER_MODE.CUSTOMIZER} />);
