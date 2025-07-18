import { useNavigate } from "@tanstack/react-router";
import { Auth } from '@supabase/auth-ui-react';
import { Heading } from "@radix-ui/themes";
import { useAuth } from "../../contexts/auth";
import { supabase } from '../../services/supabase';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from "react";

interface LoginProps {
  redirect?: string;
}

export function Login({ redirect }: LoginProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      navigate({ to: redirect || "/" });
    }
  }, [auth, navigate, redirect]);

  return (
    <div>
      <Heading size="6" mb="4">Login</Heading>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
    </div>
  );
} 