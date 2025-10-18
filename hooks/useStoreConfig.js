import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";

export default function useStoreConfig() {
  const { data } = useFetch("/manifest.json");
  const [storeConfig, setStoreConfig] = useState(null);

  useEffect(() => {
    const { items } = data;
    const url = new URL(window.location.href);
    const storeId = url.searchParams.get("store_id");

    const storeConfig = storeId?.trim()
      ? items.find(config => config.store_id === storeId)
      : items[0];

    setStoreConfig(storeConfig);
  }, [data]);

  return { current: storeConfig };
}
