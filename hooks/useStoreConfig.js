import { useEffect } from "react";
import { fetchConfig, setConfigFetchStatus } from "../states/app";
import { useDispatch, useSelector } from "react-redux";

export default function useStoreConfig() {
  const dispatch = useDispatch();
  const storeConfig = useSelector(state => state.app.storeConfig);

  useEffect(() => {
    dispatch(fetchConfig());
    dispatch(setConfigFetchStatus(true));
  }, []);

  return { current: storeConfig };
}
