import { debounce } from "lodash";
import { useState } from "react";

export default function useResizeObserver() {
  const [callbackMap, setCallbackMap] = useState({});

  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      callbackMap?.[entry.target]?.();
    }
  });

  const observe = ($el, onResize = () => {}) => {
    setCallbackMap(prev => ({
      ...prev,
      [$el]: debounce(() => onResize(), 100)
    }));
    resizeObserver.observe($el);
  };

  return observe;
}
