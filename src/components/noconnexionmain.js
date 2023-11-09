import React from "react";
import "../style/noconnexionmain.css";
import LogoDimension from "../assets/png/1.png";

const noconnexionmain = () => {
  return (
    <>
      <div className="accueil">
        <div className="container">
          <img src={LogoDimension} className="png" alt="logo" />
        </div>

        <div className="container-description">
          <p className="description">
            Dimension est une application musicale qui permet aux utilisateurs à
            rester motivés et concentrés lorsqu'ils travaillent, font de
            l'exercice ou méditent. Construit avec React, Dimension offre une
            expérience utilisateur fluide et intuitive, avec un design épuré et
            simple qui est facile à naviguer. Facile à utiliser vous avez la
            possibilité de personnaliser votre musique en sélectionnant
            différentes pistes, en ajustant le volume. Fonctionne sur plusieurs
            appareils et plates-formes. Pour utiliser Dimension, connectez-vous
            simplement.
          </p>
        </div>
      </div>
      <div className="messagedefilant">
        <h2>
          <span className="span">
            A Music App for Focus and Motivation - A Music App for Focus and
            Motivation - A Music App for Focus and Motivation
          </span>
        </h2>
      </div>
    </>
  );
};

export default noconnexionmain;
