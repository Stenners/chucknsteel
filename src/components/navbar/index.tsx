import { Flex } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";

const NavBar = () => {
  return (
    <Flex mx="3" my="2">
      <Link to="/">
        <img src="/logo.svg" width="50" height="50" />
      </Link>
    </Flex>
  );
};

export default NavBar;
