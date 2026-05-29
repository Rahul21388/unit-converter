// Tracks whether the user has unlocked "Remove Ads" (mock IAP).
// Persisted via the project's AsyncStorage wrapper.

import { useCallback, useEffect, useState } from "react";
import { storage } from "@/src/utils/storage";

const KEY = "ads_removed_v1";

export function useAdsRemoved() {
  const [adsRemoved, setAdsRemoved] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    storage.getItem<boolean>(KEY, false).then((v) => {
      if (!mounted) return;
      setAdsRemoved(!!v);
      setLoaded(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const removeAds = useCallback(async () => {
    await storage.setItem(KEY, true);
    setAdsRemoved(true);
  }, []);

  const restoreAds = useCallback(async () => {
    await storage.setItem(KEY, false);
    setAdsRemoved(false);
  }, []);

  return { adsRemoved, loaded, removeAds, restoreAds };
}
