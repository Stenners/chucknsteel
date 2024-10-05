import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { type AuthContext } from "../contexts/auth";
import { Container } from "@radix-ui/themes/src/index.js";
import { checkAuth } from "../services/supabase";

interface MyRouterContext {
  auth: AuthContext;
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
      <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
    </>
  ),
});
