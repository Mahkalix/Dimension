import React from "react";
import "../style/card.css";
import PlayIcon from "../assets/svg/play.svg";
import PauseIcon from "../assets/svg/pause.svg";

const Card = ({ musicData, play, currentUrl, isPlaying }) => {
  const isCurrentTrack = currentUrl === musicData.url;
  const isCurrentPlaying = isCurrentTrack && isPlaying;

  const handleCardClick = () => {
    play(musicData.url);
  };

  return (
    <li
      className={`card ${isCurrentPlaying ? "playing" : ""}`}
    >
      <button
        type="button"
        className="card__button"
        onClick={handleCardClick}
        aria-label={`${isCurrentPlaying ? "Pause" : "Play"} ${musicData.title}`}
      >
        <img className="gif" src={musicData.gif} alt="" />
        <span className="card__overlay" aria-hidden="true">
          <img
            className="playback-icon"
            src={isCurrentPlaying ? PauseIcon : PlayIcon}
            alt=""
          />
        </span>
      </button>
      <h3 className="title" title={musicData.title}>
        {musicData.title}
      </h3>
    </li>
  );
};

export default Card;
