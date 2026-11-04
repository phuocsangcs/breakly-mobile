// Sign-up screen composing user registration form fields and actions.
import React from "react";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/features/auth";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  return <AuthForm title="Create Account" submitLabel="Sign Up" withName onSubmit={signUp} />;
}
