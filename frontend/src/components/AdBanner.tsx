// Placeholder AdMob banner. Real SDK will be wired later — for now we just
// render a 50px tall block labelled "Ad" so the UI reserves space correctly.

import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";

interface Props {
  hidden?: boolean;
}

export default function AdBanner({ hidden }: Props) {
  const scheme = useColorScheme();
  if (hidden) return null;
  const isDark = scheme === "dark";
  return (
    <View
      testID="ad-banner"
      style={[
        styles.banner,
        { backgroundColor: isDark ? "#27272A" : "#E4E4E7" },
      ]}
    >
      <Text style={[styles.label, { color: isDark ? "#A1A1AA" : "#52525B" }]}>
        AdMob Banner (placeholder)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
