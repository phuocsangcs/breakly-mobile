// Sign-in screen composing authentication inputs and actions.
import React from "react";
import { router } from "expo-router";
import { AuthForm } from "@/components/AuthForm";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth";

export default function SignInScreen() {
  const { signIn } = useAuth();
  return (
    <AuthForm
      title="Welcome Back"
      submitLabel="Sign In"
      onSubmit={signIn}
      footer={<Button label="Create an account" variant="secondary" onPress={() => router.push("/sign-up")} />}
    />
  );
}
