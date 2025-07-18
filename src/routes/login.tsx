import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Login } from "../components/login/Login";

const LoginView = () => {
  const search = useSearch({ from: "/login" }) as { redirect?: string };
  return <Login redirect={search.redirect} />;
};

export const Route = createFileRoute("/login")({
  component: LoginView,
});