import React, { useRef, useState } from "react";
import Cardg from "../components/cardgirl.js";
import datag from "../data/datamusicgirl.json";

function MusicPlayer() {
  const audioRef = useRef(new Audio());
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const PlayPause = (url) => {
    const audio = audioRef.current;
    if (audio.src === url) {
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

  return (
    <>
      {error ? (
        <p>Error loading audio file</p>
      ) : (
        <>
          {datag.map((item, index) => (
            <Cardg
              key={index}
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
