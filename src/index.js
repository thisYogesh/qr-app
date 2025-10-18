import React from "react";
import { createRoot } from "react-dom/client";
import MyApp from "./my-app";

const $app = document.querySelector("[data-render-app]");

const root = createRoot($app);
root.render(<MyApp />);
