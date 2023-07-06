import React, { useState } from "react";
import Dimension from "../assets/png/2.png";
import "../style/header.css";
import LogButton from "./logbutton";

const Header = () => {
  const [IsLogged, setIsLogged] = useState(false);

  return (
    <header>
      <LogButton setIsLogged={setIsLogged} IsLogged={IsLogged} />

      <a
        href="https://github.com/Mahkalix/lofi"
        target="_blank"
        rel="noreferrer"
      >
        <div>
          <img
            className="title-landing-page"
            src={Dimension}
            alt="logo dimension"
          />{" "}
        </div>
      </a>
    </header>
  );
};

export default Header;
