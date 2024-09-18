import React, { useState } from "react";
import "../style/header.css";
import { LogButton } from "./logbutton";
import { Link } from "react-router-dom";

const Header = () => {
  const [IsLogged, setIsLogged] = useState(false);

  return (
    <header>
      <Link to="/">
        <p>Dimension</p>
      </Link>
      <LogButton setIsLogged={setIsLogged} IsLogged={IsLogged} />
    </header>
  );
};

export default Header;
