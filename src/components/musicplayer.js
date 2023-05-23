import React, { useRef, useState } from "react";
import Card from "../components/card";
import data from "../data/datamusic.json";

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
          {data.map((item, index) => (
            <Card
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
