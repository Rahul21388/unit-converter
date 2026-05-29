// Converter Screen — From/To unit pickers, numeric keyboard input, prominent
// result, and swap button.

import React, { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { categoryColors, getCategory } from "@/src/constants/units";
import { convert, formatResult } from "@/src/utils/converter";
import UnitPicker from "@/src/components/UnitPicker";
import AdBanner from "@/src/components/AdBanner";
import { useAdsRemoved } from "@/src/hooks/useAdsRemoved";

export default function ConverterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const { adsRemoved } = useAdsRemoved();
  const { category: categoryKey } = useLocalSearchParams<{ category: string }>();

  const category = useMemo(
    () => getCategory(categoryKey ?? "length"),
    [categoryKey],
  );

  const previousValue = useRef<string>("");

  const [fromKey, setFromKey] = useState<string>(
    category?.units[0]?.key ?? "",
  );
  const [toKey, setToKey] = useState<string>(category?.units[1]?.key ?? "");
  const [input, setInput] = useState<string>("1");
  const [showPicker, setShowPicker] = useState<"from" | "to" | null>(null);

  if (!category) {
    return (
      <View style={styles.fallback}>
        <Text>Unknown category</Text>
      </View>
    );
  }

  const colors = categoryColors[category.key];
  const fromUnit = category.units.find((u) => u.key === fromKey)!;
  const toUnit = category.units.find((u) => u.key === toKey)!;

  const numericValue = parseFloat(input.replace(",", "."));
  const resultValue = !isNaN(numericValue)
    ? convert(numericValue, fromUnit, toUnit, category)
    : NaN;
  const resultText = isNaN(resultValue) ? "—" : formatResult(resultValue);

  const surface = isDark ? "#09090B" : "#FAFAFA";
  const card = isDark ? "#18181B" : "#FFFFFF";
  const textPrimary = isDark ? "#FAFAFA" : "#0A0A0A";
  const textSecondary = isDark ? "#A1A1AA" : "#52525B";

  const handleInputChange = (raw: string) => {
    // Allow digits, dot, minus only.
    const cleaned = raw.replace(/[^0-9.\-]/g, "");
    setInput(cleaned);

    // Count meaningful conversions: when the user provides a new valid number
    // distinct from the previous one.
    const v = parseFloat(cleaned);
    if (!isNaN(v) && cleaned !== previousValue.current) {
      previousValue.current = cleaned;
    }
  };

  const handleSwap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setFromKey(toKey);
    setToKey(fromKey);
  };

  return (
    <View style={[styles.root, { backgroundColor: surface }]} testID="converter-screen">
      {/* Colored header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.bg, paddingTop: insets.top + 8 },
        ]}
      >
        <TouchableOpacity
          testID="back-button"
          onPress={() => router.back()}
          style={[styles.headerIcon, { backgroundColor: "#FFFFFFAA" }]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[styles.headerEmoji]}>{category.icon}</Text>
          <Text
            style={[styles.headerTitle, { color: colors.text }]}
            testID="category-title"
          >
            {category.name}
          </Text>
        </View>
        <View style={styles.headerIcon} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* FROM zone */}
          <View style={[styles.zone, { backgroundColor: card }]}>
            <Text style={[styles.zoneLabel, { color: textSecondary }]}>
              FROM
            </Text>
            <TouchableOpacity
              testID="from-unit-picker"
              activeOpacity={0.7}
              onPress={() => setShowPicker("from")}
              style={[styles.pill, { backgroundColor: colors.bg }]}
            >
              <Text style={[styles.pillText, { color: colors.text }]}>
                {fromUnit.label} ({fromUnit.symbol})
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.text} />
            </TouchableOpacity>
            <TextInput
              testID="value-input"
              value={input}
              onChangeText={handleInputChange}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={textSecondary}
              style={[styles.input, { color: textPrimary }]}
              maxLength={20}
              selectTextOnFocus
            />
          </View>

          {/* Swap button */}
          <View style={styles.swapRow}>
            <View style={[styles.divider, { backgroundColor: isDark ? "#27272A" : "#E4E4E7" }]} />
            <TouchableOpacity
              testID="swap-button"
              onPress={handleSwap}
              activeOpacity={0.8}
              style={[
                styles.swapBtn,
                { backgroundColor: colors.icon },
                !isDark && styles.brutalShadow,
              ]}
            >
              <Ionicons name="swap-vertical" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: isDark ? "#27272A" : "#E4E4E7" }]} />
          </View>

          {/* TO zone */}
          <View style={[styles.zone, { backgroundColor: card }]}>
            <Text style={[styles.zoneLabel, { color: textSecondary }]}>
              TO
            </Text>
            <TouchableOpacity
              testID="to-unit-picker"
              activeOpacity={0.7}
              onPress={() => setShowPicker("to")}
              style={[styles.pill, { backgroundColor: colors.bg }]}
            >
              <Text style={[styles.pillText, { color: colors.text }]}>
                {toUnit.label} ({toUnit.symbol})
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.text} />
            </TouchableOpacity>
            <Text
              testID="result-output"
              style={[styles.result, { color: colors.icon }]}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {resultText}
            </Text>
          </View>

          <Text
            testID="formula-hint"
            style={[styles.hint, { color: textSecondary }]}
          >
            {!isNaN(numericValue)
              ? `${formatResult(numericValue)} ${fromUnit.symbol} = ${resultText} ${toUnit.symbol}`
              : "Enter a number to convert"}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ paddingBottom: insets.bottom }}>
        <AdBanner hidden={adsRemoved} />
      </View>

      <UnitPicker
        visible={showPicker === "from"}
        title="Select FROM unit"
        accent={colors.icon}
        units={category.units}
        selectedKey={fromKey}
        onSelect={setFromKey}
        onClose={() => setShowPicker(null)}
      />
      <UnitPicker
        visible={showPicker === "to"}
        title="Select TO unit"
        accent={colors.icon}
        units={category.units}
        selectedKey={toKey}
        onSelect={setToKey}
        onClose={() => setShowPicker(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerEmoji: { fontSize: 28, marginBottom: 4 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  zone: {
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  zoneLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    alignSelf: "flex-start",
    gap: 8,
  },
  pillText: { fontSize: 14, fontWeight: "700" },
  input: {
    fontSize: 56,
    fontWeight: "800",
    letterSpacing: -2,
    paddingVertical: 8,
  },
  result: {
    fontSize: 56,
    fontWeight: "800",
    letterSpacing: -2,
    paddingVertical: 8,
  },
  swapRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8,
  },
  divider: { flex: 1, height: 2, borderRadius: 1 },
  swapBtn: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  brutalShadow: {
    shadowColor: "#0A0A0A",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  hint: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});
