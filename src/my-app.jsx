import React, { useEffect } from "react";
import AppHelper from "./app-helper";

export default () => {
  // on mounted
  useEffect(() => {
    AppHelper.install();
  }, []);

  return <div data-app>App area</div>;
};
