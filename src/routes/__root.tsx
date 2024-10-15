import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { type AuthContext } from "../contexts/auth";
import { Container } from "@radix-ui/themes";
import { checkAuth } from "../services/supabase";
import NavBar from "../components/navbar";

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
      <NavBar />
      <Container m="4" mt="0">
        <Outlet />
      </Container>
    </>
  ),
});
