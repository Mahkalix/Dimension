import React from "react";
import datag from "../data/datamusicgirl.json";

const Card = ({ musicData, play }) => {
  console.log(datag[0].categorie);
  return (
    <>
      <div onClick={play} className="card" alt="gif">
        <img className="gif" src={musicData.gif} alt="gif" />
        <h1 className="title girl" title={musicData.title}>
          {musicData.title}
        </h1>
      </div>
    </>
  );
};

export default Card;
