import React, { useState, useRef } from "react";
import "../style/musicplayer.css";
import off from "../assets/svg/off.svg";
import medium from "../assets/svg/medium.svg";
import high from "../assets/svg/high.svg";

const Handlevolume = ({ audioRef }) => {
  const [volume, setVolume] = useState(0.5);

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };
  return (
    <>
      <div className="container-volume">
        <div className="container-logovolume">
          <img className="logovolume" src={off} alt="off" />
          <img className="logovolume" src={medium} alt="medium" />
          <img className="logovolume" src={high} alt="high" />
        </div>
        <div className="volume">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </>
  );
};

export default Handlevolume;
