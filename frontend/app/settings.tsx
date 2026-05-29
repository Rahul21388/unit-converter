// Settings — currently houses just the "Remove Ads" mock IAP flow.

import React from "react";
import {
  Alert,
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
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useAdsRemoved } from "@/src/hooks/useAdsRemoved";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const { adsRemoved, removeAds, restoreAds, loaded } = useAdsRemoved();

  const bg = isDark ? "#09090B" : "#FAFAFA";
  const surface = isDark ? "#18181B" : "#FFFFFF";
  const textPrimary = isDark ? "#FAFAFA" : "#0A0A0A";
  const textSecondary = isDark ? "#A1A1AA" : "#52525B";

  const handlePurchase = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    Alert.alert(
      "Remove Ads",
      "This is a placeholder purchase. In production this would launch the platform billing sheet for ₹99.\n\nProceed with mock purchase?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Purchase ₹99",
          onPress: async () => {
            await removeAds();
            Alert.alert("Thanks!", "Ads have been removed. Enjoy!");
          },
        },
      ],
    );
  };

  const handleRestoreAds = () => {
    Alert.alert(
      "Restore Ads (debug)",
      "Bring back the ads (for testing).",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Restore", onPress: restoreAds },
      ],
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]} testID="settings-screen">
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          testID="settings-back-button"
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={[
            styles.iconBtn,
            { backgroundColor: surface },
            !isDark && styles.brutalShadow,
          ]}
        >
          <Ionicons name="chevron-back" size={22} color={textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textPrimary }]}>Settings</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionLabel, { color: textSecondary }]}>
          MONETISATION
        </Text>

        {loaded && adsRemoved ? (
          <View
            testID="ads-removed-state"
            style={[
              styles.successCard,
              { backgroundColor: surface, borderColor: "#10B981" },
            ]}
          >
            <Ionicons name="checkmark-circle" size={28} color="#10B981" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.successTitle, { color: textPrimary }]}>
                Ads Removed
              </Text>
              <Text style={[styles.successSub, { color: textSecondary }]}>
                Thanks for supporting the app!
              </Text>
            </View>
          </View>
        ) : (
          <Pressable
            testID="remove-ads-button"
            onPress={handlePurchase}
            style={({ pressed }) => [
              styles.ctaWrap,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
          >
            <LinearGradient
              colors={["#F97316", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cta}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.ctaTitle}>Remove Ads</Text>
                <Text style={styles.ctaSub}>
                  One-time purchase. Hides all ads forever.
                </Text>
              </View>
              <Text style={styles.ctaPrice}>₹99</Text>
            </LinearGradient>
          </Pressable>
        )}

        <Text
          style={[styles.sectionLabel, { color: textSecondary, marginTop: 32 }]}
        >
          ABOUT
        </Text>
        <View style={[styles.aboutCard, { backgroundColor: surface }]}>
          <Row label="App" value="Unit Converter" textPrimary={textPrimary} textSecondary={textSecondary} />
          <Row label="Version" value="1.0.0" textPrimary={textPrimary} textSecondary={textSecondary} />
          <Row label="Categories" value="8" textPrimary={textPrimary} textSecondary={textSecondary} />
          <Row label="Mode" value="100% Offline" textPrimary={textPrimary} textSecondary={textSecondary} last />
        </View>

        {adsRemoved && (
          <TouchableOpacity
            testID="restore-ads-button"
            onPress={handleRestoreAds}
            style={{ marginTop: 24, alignSelf: "center" }}
          >
            <Text style={{ color: textSecondary, fontSize: 12 }}>
              Restore ads (debug)
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  value,
  textPrimary,
  textSecondary,
  last,
}: {
  label: string;
  value: string;
  textPrimary: string;
  textSecondary: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.aboutRow,
        !last && { borderBottomWidth: 1, borderBottomColor: "rgba(127,127,127,0.15)" },
      ]}
    >
      <Text style={[styles.aboutLabel, { color: textSecondary }]}>{label}</Text>
      <Text style={[styles.aboutValue, { color: textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
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
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  content: { padding: 24, paddingBottom: 80 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  ctaWrap: { borderRadius: 20, overflow: "hidden" },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  ctaSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    fontWeight: "500",
  },
  ctaPrice: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  successCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
  },
  successTitle: { fontSize: 18, fontWeight: "800" },
  successSub: { fontSize: 13, marginTop: 2 },
  aboutCard: { borderRadius: 20, paddingHorizontal: 20 },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  aboutLabel: { fontSize: 14, fontWeight: "600" },
  aboutValue: { fontSize: 14, fontWeight: "700" },
});
