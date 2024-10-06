import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { type AuthContext } from "../contexts/auth";
import { Container } from "@radix-ui/themes";
import { checkAuth } from "../services/supabase";

interface MyRouterContext {
  auth: typeof AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const user = await checkAuth();

    return {
      user,
    }
  },
  component: () => (
    <>
      <Container>
        <Outlet />
      </Container>
    </>
  ),
});
