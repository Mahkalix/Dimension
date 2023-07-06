import React from "react";
import "../style/noconnexionmain.css";
import LogoDimension from "../assets/png/Dimension.png";

const noconnexionmain = () => {
  return (
    <>
      <div className="accueil">
        <div className="container">
          <img src={LogoDimension} className="png" alt="logo" />
          <h1>Bienvenue!</h1>
          <p className="sous-titre">Chill & Relaxing</p>
        </div>

        <div className="container-description">
          <div className="messagedefilant">
            <h2 data-text="A Music App for Focus and Motivation">
              <span className="span">A Music App for Focus and Motivation</span>
            </h2>
          </div>
          <p className="description">
            Dimension est une application musicale qui permet aux utilisateurs à
            rester motivés et concentrés lorsqu'ils travaillent, font de
            l'exercice ou méditent. Construit avec React, Dimension offre une
            expérience utilisateur fluide et intuitive, avec un design épuré et
            simple qui est facile à naviguer. Facile à utiliser vous avez la
            possibilité de personnaliser votre musique expérience en
            sélectionnant différentes pistes, en ajustant le volume. Fonctionne
            sur plusieurs appareils et plates-formes. Pour utiliser Dimension,
            connectez-vous simplement.
          </p>
        </div>
      </div>
    </>
  );
};

export default noconnexionmain;
