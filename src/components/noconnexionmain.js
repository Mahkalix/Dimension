import React from "react";
import "../style/noconnexionmain.css";
import LogoDimension from "../assets/png/Dimension.png";

const noconnexionmain = () => {
  return (
    <div className="accueil">
      <div className="container">
        <img src={LogoDimension} className="png" alt="logo" />
        <h1>Bienvenue!</h1>
        <p className="sous-titre">Chill & Relaxing</p>
      </div>
    </div>
  );
};

export default noconnexionmain;
