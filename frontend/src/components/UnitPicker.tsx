// Modal bottom-sheet picker for selecting a unit.
// Receives the list of units and the current selection, calls onSelect with the new key.

import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { UnitDef } from "@/src/constants/units";

interface Props {
  visible: boolean;
  title: string;
  accent: string;
  units: UnitDef[];
  selectedKey: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}

export default function UnitPicker({
  visible,
  title,
  accent,
  units,
  selectedKey,
  onSelect,
  onClose,
}: Props) {
  const isDark = useColorScheme() === "dark";
  const surface = isDark ? "#18181B" : "#FFFFFF";
  const text = isDark ? "#FAFAFA" : "#0A0A0A";
  const subtext = isDark ? "#A1A1AA" : "#52525B";
  const divider = isDark ? "#27272A" : "#F4F4F5";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} testID="picker-backdrop">
        <Pressable
          style={[styles.sheet, { backgroundColor: surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={[styles.title, { color: text }]} testID="picker-title">
            {title}
          </Text>
          <ScrollView style={styles.list} bounces={false}>
            {units.map((u) => {
              const selected = u.key === selectedKey;
              return (
                <TouchableOpacity
                  key={u.key}
                  testID={`picker-option-${u.key}`}
                  activeOpacity={0.7}
                  style={[
                    styles.row,
                    { borderBottomColor: divider },
                    selected && { backgroundColor: accent + "22" },
                  ]}
                  onPress={() => {
                    onSelect(u.key);
                    onClose();
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowLabel, { color: text }]}>
                      {u.label}
                    </Text>
                    <Text style={[styles.rowSymbol, { color: subtext }]}>
                      {u.symbol}
                    </Text>
                  </View>
                  {selected && (
                    <View style={[styles.dot, { backgroundColor: accent }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: "75%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#A1A1AA",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  list: { paddingHorizontal: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderRadius: 12,
  },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  rowSymbol: { fontSize: 13, marginTop: 2, letterSpacing: 0.5 },
  dot: { width: 12, height: 12, borderRadius: 6 },
});
