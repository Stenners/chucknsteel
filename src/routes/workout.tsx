import { createFileRoute, redirect } from "@tanstack/react-router";
import { Workout } from "../components/workout/Workout";

export const Route = createFileRoute("/workout")({
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
  component: Workout,
});
