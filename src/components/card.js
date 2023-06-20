import React from "react";

const Card = ({ musicData, play, isPlaying }) => {
  return (
    <>
      <button onClick={play} className="card" alt="gif">
        <img className="gif" src={musicData.gif} alt="gif" />
        <h1 className="title" title={musicData.title}>
          {musicData.title}
        </h1>
      </button>
    </>
  );
};

export default Card;
