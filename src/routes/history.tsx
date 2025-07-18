import { createFileRoute, redirect } from "@tanstack/react-router";
import { History } from "../components/history/History";

export const Route = createFileRoute("/history")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: History,
});
