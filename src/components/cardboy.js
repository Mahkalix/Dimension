import React from "react";
import datab from "../data/datamusicboy.json";

const Card = ({ musicData, play }) => {
  return (
    <>
      <div onClick={play} className="card" alt="gif">
        <img className="gif" src={musicData.gif} alt="gif" />
        <h1 className="title boy" title={musicData.title}>
          {musicData.title}
        </h1>
      </div>
    </>
  );
};

export default Card;
