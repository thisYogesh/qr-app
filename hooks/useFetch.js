import { useEffect, useState } from "react";

export function useFetch(input, options) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    fetch(input, options)
      .then(res => res.json())
      .then(json => {
        if (active) setData(json);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [input, options]);

  return { data, isLoading };
}
