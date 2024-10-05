import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Auth } from '@supabase/auth-ui-react'
import { useAuth } from "../contexts/auth";
import { supabase } from '../services/supabase';
import { ThemeSupa } from '@supabase/auth-ui-shared'
// import { Button } from "@radix-ui/themes";
import { useEffect } from "react";

const LoginView = () => {
  const auth = useAuth();
  const navigate = useNavigate()
  const search = Route.useSearch() as { redirect?: string };

  useEffect(() => {
    if (auth.user) {
      navigate({ to: search.redirect || "/" });
    }
  }, [auth, navigate, search]);

  return (
    <div>
      <h1>Login</h1>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
    </div>
  );
};

export const Route = createFileRoute("/login")({
  component: LoginView,
});