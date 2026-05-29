import { useCallback, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { storage } from "@/src/utils/storage";

type ThemePref = "light" | "dark" | "system";
const KEY = "theme_pref_v1";

export function useThemePreference() {
  const [pref, setPref] = useState<ThemePref>("system");

  useEffect(() => {
    storage.getItem<ThemePref>(KEY, "system").then((saved) => {
      if (saved === "light" || saved === "dark") {
        Appearance.setColorScheme(saved);
      }
      setPref(saved);
    });
  }, []);

  const setTheme = useCallback(async (next: ThemePref) => {
    await storage.setItem(KEY, next);
    Appearance.setColorScheme(next === "system" ? null : next);
    setPref(next);
  }, []);

  return { pref, setTheme };
}
