import { createFileRoute } from "@tanstack/react-router";
import { PlateCalc } from "../components/platecalc/PlateCalc";

export const Route = createFileRoute("/platecalc")({
  component: PlateCalc,
});
