import React from "react";
import "../style/card.css";
import PlayIcon from "../assets/svg/play.svg";
import PauseIcon from "../assets/svg/pause.svg";

const Card = ({ musicData, play, isPlaying }) => {
  return (
    <>
      <button onClick={play} className="card" alt="gif">
        <img className="gif" src={musicData.gif} alt="gif" />
        {!isPlaying ? (
          <img className="Pause" src={PauseIcon} alt="Pause" />
        ) : (
          <img className="Play" src={PlayIcon} alt="Play" />
        )}
        <h1 className="title" title={musicData.title}>
          {musicData.title}
        </h1>
      </button>
    </>
  );
};

export default Card;
