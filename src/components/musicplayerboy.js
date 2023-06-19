import React, { useRef, useState } from "react";
import Cardb from "./cardboy.js";
import datab from "../data/datamusicboy.json";

function MusicPlayer() {
  const audioRef = useRef(new Audio());
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const PlayPause = (url) => {
    const audio = audioRef.current;
    if (isPlaying === true) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          setError(true);
          console.error("Error playing audio:", error);
        });
      }
    } else {
      audio.src = url;
      audio.play().catch((error) => {
        setError(true);
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  return (
    <>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
      {error ? (
        <p>Error loading audio file</p>
      ) : (
        <>
          {datab.map((item, index) => (
            <Cardb
              key={index}
              title={item.title}
              musicData={item}
              play={() => PlayPause(item.url)}
              isPlaying={isPlaying && audioRef.current.src === item.url}
            />
          ))}
        </>
      )}
    </>
  );
}

export default MusicPlayer;
