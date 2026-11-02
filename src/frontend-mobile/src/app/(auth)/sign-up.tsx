// Sign-up screen composing user registration form fields and actions.
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Colors, Spacing } from "@/constants/theme";

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Input placeholder="Full Name" />
      <Input placeholder="Email" />
      <Input placeholder="Password" secureTextEntry />
      <Button label="Sign Up" />
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
