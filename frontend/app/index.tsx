// Home Screen — 2-column grid of 8 colorful unit conversion categories.
// Tapping a card navigates to /converter?category=<key>.

import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { CATEGORIES, categoryColors } from "@/src/constants/units";
import AdBanner from "@/src/components/AdBanner";
import { useAdsRemoved } from "@/src/hooks/useAdsRemoved";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const { adsRemoved } = useAdsRemoved();

  const bg = isDark ? "#09090B" : "#FAFAFA";
  const textPrimary = isDark ? "#FAFAFA" : "#0A0A0A";
  const textSecondary = isDark ? "#A1A1AA" : "#52525B";

  return (
    <View style={[styles.root, { backgroundColor: bg }]} testID="home-screen">
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.brand, { color: textSecondary }]}>
            UNIT CONVERTER
          </Text>
          <Text style={[styles.title, { color: textPrimary }]}>
            Convert anything,{"\n"}instantly.
          </Text>
        </View>
        <TouchableOpacity
          testID="settings-button"
          activeOpacity={0.7}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            router.push("/settings");
          }}
          style={[
            styles.iconBtn,
            { backgroundColor: isDark ? "#18181B" : "#FFFFFF" },
            !isDark && styles.brutalShadow,
          ]}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.gridScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {CATEGORIES.map((cat) => {
            const colors = categoryColors[cat.key];
            return (
              <Pressable
                key={cat.key}
                testID={`category-card-${cat.key}`}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                    () => {},
                  );
                  router.push({
                    pathname: "/converter",
                    params: { category: cat.key },
                  });
                }}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: colors.bg },
                  !isDark && styles.cardBrutal,
                  isDark && styles.cardDark,
                  pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
                ]}
              >
                <Text style={styles.cardIcon}>{cat.icon}</Text>
                <Text style={[styles.cardName, { color: colors.text }]}>
                  {cat.name}
                </Text>
                <Text style={[styles.cardSub, { color: colors.text }]}>
                  {cat.units.length} units
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ paddingBottom: insets.bottom }}>
        <AdBanner hidden={adsRemoved} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  brand: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    letterSpacing: -1,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0A0A0A",
  },
  brutalShadow: {
    shadowColor: "#0A0A0A",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  gridScroll: { paddingHorizontal: 24, paddingBottom: 24 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  card: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
  },
  cardBrutal: {
    borderWidth: 2,
    borderColor: "#0A0A0A",
    shadowColor: "#0A0A0A",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  cardDark: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardIcon: { fontSize: 36 },
  cardName: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  cardSub: { fontSize: 12, fontWeight: "600", opacity: 0.8 },
});
