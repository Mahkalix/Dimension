import React from "react";
import "../style/noconnexionmain.css";
import LogoDimension from "../assets/png/1.png";

const Noconnexionmain = () => {
  return (
    <>
      <div className="accueil">
        <div className="container">
          <img src={LogoDimension} className="png" alt="logo" />
        </div>

        <div className="container-description">
          <p className="description">Focus and Motivation</p>
        </div>
      </div>
    </>
  );
};

export default Noconnexionmain;
