import React, { useState } from "react";
import Dimension from "../assets/png/2.png";
import "../style/header.css";
import { LogButton } from "./logbutton";
import { Link } from "react-router-dom";

const Header = () => {
  const [IsLogged, setIsLogged] = useState(false);

  return (
    <header>
      <LogButton setIsLogged={setIsLogged} IsLogged={IsLogged} />

      <Link to="/">
        <div>
          <img
            className="title-landing-page"
            src={Dimension}
            alt="logo dimension"
          />
        </div>
      </Link>
    </header>
  );
};

export default Header;
