import React, { useState, useEffect } from "react";
import "../style/card.css";
import PlayIcon from "../assets/svg/play.svg";
import PauseIcon from "../assets/svg/pause.svg";

const Card = ({ musicData, play, currentUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(currentUrl === musicData.url);
  }, [currentUrl, musicData.url]);

  const handleCardClick = () => {
    if (isPlaying) {
      play(musicData.url);
      setIsPlaying(false);
    } else {
      play(musicData.url); // Reprendre la lecture
      setIsPlaying(true);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`card ${isPlaying ? "playing" : ""}`}
      alt=""
    >
      <img className="gif" src={musicData.gif} alt="gif" />
      {!isPlaying ? (
        <img className="Pause" src={PauseIcon} alt="Pause" />
      ) : (
        <img className="Play" src={PlayIcon} alt="Play" />
      )}
      <h1 className="title" title={musicData.title}>
        {musicData.title}
      </h1>
    </div>
  );
};

export default Card;
