import React from "react";
import "../style/header.css";
import { LogButton } from "./logbutton";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="site-header">
      <Link className="site-brand" to="/" aria-label="Dimension — accueil">
        Dimension
      </Link>
      <LogButton />
    </header>
  );
};

export default Header;
