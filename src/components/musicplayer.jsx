import React, { useEffect, useRef, useState } from "react";
import Card from "./card.jsx";
import data from "../data/datamusic.json";
import "../style/musicplayer.css";
import Volume from "../components/handlevolume.jsx";

function MusicPlayer() {
  const audioRef = useRef(new Audio());
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const togglePlay = (url) => {
    const audio = audioRef.current;

    if (currentUrl === url) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          setError(true);
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying((playing) => !playing);
    } else {
      setCurrentUrl(url);
      audio.src = url;
      audio.play().catch((error) => {
        setError(true);
        console.error("Error playing audio:", error);
      });
      setIsPlaying(true);
    }
  };

  const boy = data.filter((item) => item.categorie === "boy");
  const girl = data.filter((item) => item.categorie === "girl");

  return (
    <>
      <section className="music-player" aria-label="Music player">
        <div className="music-player__controls">
          <Volume audioRef={audioRef} />
        </div>
      <div className="container-lofi">
        <ul className="container-card Girl">
          {error ? (
            <li className="audio-error">Unable to load the audio file.</li>
          ) : (
            <>
              {girl.map((item) => (
                <Card
                  key={item.id}
                  musicData={item}
                  play={togglePlay}
                  currentUrl={currentUrl}
                  isPlaying={isPlaying}
                />
              ))}
            </>
          )}
        </ul>
      </div>

      <div className="container-lofi">
        <ul className="container-card Boy">
          {error ? (
            <li className="audio-error">Unable to load the audio file.</li>
          ) : (
            <>
              {boy.map((item) => (
                <Card
                  key={item.id}
                  musicData={item}
                  play={togglePlay}
                  currentUrl={currentUrl}
                  isPlaying={isPlaying}
                />
              ))}
            </>
          )}
        </ul>
      </div>
      </section>
    </>
  );
}

export default MusicPlayer;
