import React from "react";
import { createRoot } from "react-dom/client";
import Main from "./main";

const $app = document.querySelector("[data-render-app]");

const root = createRoot($app);
root.render(<Main />);
