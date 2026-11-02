// Sign-in screen composing authentication inputs and actions.
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Colors, Spacing } from "@/constants/theme";

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Input placeholder="Email" />
      <Input placeholder="Password" secureTextEntry />
      <Button label="Sign In" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.dark.background,
    justifyContent: "center",
    gap: Spacing.md,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
});
