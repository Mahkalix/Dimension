import React from "react";
import "../style/noconnexionmain.css";
import LogoDimension from "../assets/png/Dimension.png";

const noconnexionmain = () => {
  return (
    <div className="accueil">
      <div className="container">
        <img src={LogoDimension} className="png" alt="logo" />
        <h1>Dimension</h1>
        <p className="sous-titre">Discover a new world of music</p>
      </div>
    </div>
  );
};

export default noconnexionmain;
