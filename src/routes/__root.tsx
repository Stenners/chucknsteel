import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { type AuthContext } from "../contexts/auth";
import { Container } from "@radix-ui/themes";
import { checkAuth } from "../services/supabase";
import Sidebar from "../components/sidebar";

interface MyRouterContext {
  auth: typeof AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const user = await checkAuth();
    return {
      user,
    };
  },
  component: () => (
    <>
      <Sidebar />
      <Container m="4">
        <Outlet />
      </Container>
    </>
  ),
});
