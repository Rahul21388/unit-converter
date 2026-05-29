// Settings — Remove Ads IAP, appearance, support, and about.

import React from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
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
import Constants from "expo-constants";

import { useRemoveAdsPurchase } from "@/src/hooks/useRemoveAdsPurchase";
import { useThemePreference } from "@/src/hooks/useThemePreference";

const PLAY_STORE_URL =
  "market://details?id=com.rahulprakash.unitconverter";
const FEEDBACK_EMAIL = "admin@rahulprakash.co.in";
const PRIVACY_URL =
  "https://rahulprakash.co.in/apps/unitconverter/privacy";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const { pref, setTheme } = useThemePreference();

  const {
    adsRemoved,
    loaded,
    price,
    purchasing,
    restoring,
    purchase,
    restore,
  } = useRemoveAdsPurchase();

  const bg = isDark ? "#09090B" : "#FAFAFA";
  const surface = isDark ? "#18181B" : "#FFFFFF";
  const textPrimary = isDark ? "#FAFAFA" : "#0A0A0A";
  const textSecondary = isDark ? "#A1A1AA" : "#52525B";
  const divider = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const handlePurchase = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    purchase();
  };

  const handleRestore = () => {
    Haptics.selectionAsync().catch(() => {});
    restore();
  };

  const handleRate = () => {
    Linking.openURL(PLAY_STORE_URL).catch(() =>
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.rahulprakash.unitconverter",
      ),
    );
  };

  const handleFeedback = () => {
    Linking.openURL(
      `mailto:${FEEDBACK_EMAIL}?subject=Unit%20Converter%20Feedback`,
    );
  };

  const handlePrivacy = () => {
    Linking.openURL(PRIVACY_URL);
  };

  const toggleDark = (val: boolean) => {
    Haptics.selectionAsync().catch(() => {});
    setTheme(val ? "dark" : "light");
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

        {/* ── MONETISATION ── */}
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
          <>
            <Pressable
              testID="remove-ads-button"
              onPress={handlePurchase}
              disabled={purchasing || restoring}
              style={({ pressed }) => [
                styles.ctaWrap,
                pressed && { transform: [{ scale: 0.98 }] },
                (purchasing || restoring) && { opacity: 0.6 },
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
                {purchasing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.ctaPrice}>{price}</Text>
                )}
              </LinearGradient>
            </Pressable>

            <TouchableOpacity
              testID="restore-purchase-button"
              onPress={handleRestore}
              disabled={restoring}
              style={{ marginTop: 12, alignSelf: "center" }}
            >
              {restoring ? (
                <ActivityIndicator size="small" color={textSecondary} />
              ) : (
                <Text style={{ color: textSecondary, fontSize: 13 }}>
                  Restore Purchase
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* ── APPEARANCE ── */}
        <Text style={[styles.sectionLabel, { color: textSecondary, marginTop: 32 }]}>
          APPEARANCE
        </Text>
        <View style={[styles.card, { backgroundColor: surface }]}>
          <View style={styles.cardRow}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={20}
              color={textPrimary}
              style={{ marginRight: 12 }}
            />
            <Text style={[styles.cardRowLabel, { color: textPrimary }]}>
              Dark Mode
            </Text>
            <Switch
              value={pref === "dark" || (pref === "system" && isDark)}
              onValueChange={toggleDark}
              trackColor={{ false: "#D4D4D8", true: "#F97316" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ── SUPPORT ── */}
        <Text style={[styles.sectionLabel, { color: textSecondary, marginTop: 32 }]}>
          SUPPORT
        </Text>
        <View style={[styles.card, { backgroundColor: surface }]}>
          <SupportRow
            icon="star-outline"
            label="Rate this App"
            onPress={handleRate}
            textPrimary={textPrimary}
            divider={divider}
          />
          <SupportRow
            icon="mail-outline"
            label="Send Feedback"
            onPress={handleFeedback}
            textPrimary={textPrimary}
            divider={divider}
          />
          <SupportRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={handlePrivacy}
            textPrimary={textPrimary}
            last
          />
        </View>

        {/* ── ABOUT ── */}
        <Text style={[styles.sectionLabel, { color: textSecondary, marginTop: 32 }]}>
          ABOUT
        </Text>
        <View style={[styles.card, { backgroundColor: surface }]}>
          <AboutRow label="App" value="Unit Converter" textPrimary={textPrimary} textSecondary={textSecondary} divider={divider} />
          <AboutRow label="Version" value={appVersion} textPrimary={textPrimary} textSecondary={textSecondary} divider={divider} />
          <AboutRow label="Categories" value="8" textPrimary={textPrimary} textSecondary={textSecondary} divider={divider} />
          <AboutRow label="Mode" value="100% Offline" textPrimary={textPrimary} textSecondary={textSecondary} last />
        </View>

      </ScrollView>
    </View>
  );
}

function SupportRow({
  icon,
  label,
  onPress,
  textPrimary,
  divider,
  last,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  textPrimary: string;
  divider?: string;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.cardRow,
        !last && { borderBottomWidth: 1, borderBottomColor: divider },
      ]}
    >
      <Ionicons name={icon} size={20} color={textPrimary} style={{ marginRight: 12 }} />
      <Text style={[styles.cardRowLabel, { color: textPrimary, flex: 1 }]}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={textPrimary} style={{ opacity: 0.4 }} />
    </TouchableOpacity>
  );
}

function AboutRow({
  label,
  value,
  textPrimary,
  textSecondary,
  divider,
  last,
}: {
  label: string;
  value: string;
  textPrimary: string;
  textSecondary: string;
  divider?: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.cardRow,
        !last && { borderBottomWidth: 1, borderBottomColor: divider },
      ]}
    >
      <Text style={[styles.cardRowLabel, { color: textSecondary }]}>{label}</Text>
      <Text style={[styles.cardRowValue, { color: textPrimary }]}>{value}</Text>
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
  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  cardRowLabel: { fontSize: 15, fontWeight: "600" },
  cardRowValue: { fontSize: 15, fontWeight: "700" },
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
});
