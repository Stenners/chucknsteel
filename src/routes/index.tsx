import { Flex } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

const Nav = () => {
  return (
    <Flex direction="column">
      <Link to="/">Home</Link>
      <Link to="/platecalc">Plate Calc</Link>
      <Link to="/history">History</Link>
      <Link to="/workout">Workouts</Link>
    </Flex>
  );
};

export const Route = createFileRoute("/")({
  component: Nav,
});
