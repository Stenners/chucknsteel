import { slide as Menu } from "react-burger-menu";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import "./sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <Menu isOpen={isOpen} onStateChange={({ isOpen }) => setIsOpen(isOpen)}>
      <Link to="/" onClick={closeMenu}>Home</Link>
      <Link to="/platecalc" onClick={closeMenu}>Plate Calc</Link>
      <Link to="/history" onClick={closeMenu}>History</Link>
    </Menu>
  );
};

export default Sidebar;
