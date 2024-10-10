import { slide as Menu } from "react-burger-menu";
import { Link } from "@tanstack/react-router";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <Menu>
      <Link to="/">Home</Link>
      <Link to="/platecalc">Plate Calc</Link>
      <Link to="/history">History</Link>
    </Menu>
  );
};

export default Sidebar;
