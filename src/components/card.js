import React from "react";
import data from "../data/datamusic.json";

const Card = ({ musicData, play }) => {
  console.log(data[0].categorie);
  return (
    <>
      <div onClick={play} className="card" alt="gif">
        <img className="gif" src={musicData.gif} alt="gif" />
        <h1 className="title" title={data[0].categorie}>
          bruh
        </h1>
      </div>
    </>
  );
};

export default Card;
