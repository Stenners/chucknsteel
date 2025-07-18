import { createFileRoute } from "@tanstack/react-router";
import { Index } from "../components/index/Index";

export const Route = createFileRoute("/")({
  component: Index,
});
