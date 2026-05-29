// Checks for OTA updates on app start (production builds only).
// Shows a non-blocking Alert when an update is available; errors are
// swallowed so a flaky network never crashes the app.

import { useEffect } from "react";
import { Alert } from "react-native";
import * as Updates from "expo-updates";

export function useOTAUpdate(): void {
  useEffect(() => {
    // Skip in Expo Go / dev — Updates APIs are no-ops there and
    // would otherwise log noisy warnings.
    if (__DEV__) return;

    let cancelled = false;

    (async () => {
      try {
        const result = await Updates.checkForUpdateAsync();
        if (cancelled || !result.isAvailable) return;

        await Updates.fetchUpdateAsync();
        if (cancelled) return;

        Alert.alert(
          "Update Available",
          "A new update is available. Restart the app to apply it.",
          [
            { text: "Later", style: "cancel" },
            {
              text: "Restart Now",
              onPress: () => {
                Updates.reloadAsync().catch(() => {
                  // Swallow — nothing useful to do here.
                });
              },
            },
          ],
        );
      } catch {
        // Silent: offline, dev client, etc.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
}
