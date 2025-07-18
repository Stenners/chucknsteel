import { Flex, Heading } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";

export function Index() {
  return (
    <Flex direction="column" gap="4">
      <Heading size="6" mb="4">Welcome to Chuck n Steel</Heading>
      <Link to="/">Home</Link>
      <Link to="/platecalc">Plate Calc</Link>
      <Link to="/history">History</Link>
      <Link to="/workout">Workouts</Link>
    </Flex>
  );
} 