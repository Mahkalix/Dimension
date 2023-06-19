import React, { useState } from "react";
import Logo from "../assets/music-logo.svg";
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
        <img src={Logo} className="github-link" alt="Lo-Fi" />
        <div className="text-lofi"> Dimension </div>
      </a>
    </header>
  );
};

export default Header;
