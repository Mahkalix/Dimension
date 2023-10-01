import React, { useRef, useState } from "react";
import Card from "./card.js";
import data from "../data/datamusic.json";
import "../style/musicplayer.css";
import Volume from "../components/handlevolume.js";

function MusicPlayer() {
  const audioRef = useRef(new Audio());
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);

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
      setIsPlaying(!isPlaying);
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
      <Volume audioRef={audioRef} />
      <div className="container-lofi">
        <div className="messagedefilant">
          <h1 className="title-lofi girl">
            <span className="left">Dickinson</span>
          </h1>
        </div>
        <ul className="container-card Girl">
          {error ? (
            <p>Error loading audio file</p>
          ) : (
            <>
              {girl.map((item) => (
                <Card
                  key={item.id}
                  musicData={item}
                  play={togglePlay}
                  currentUrl={currentUrl}
                />
              ))}
            </>
          )}
        </ul>
      </div>

      <div className="container-lofi">
        <div className="messagedefilant">
          <h1 className="title-lofi boy">
            {" "}
            <span className="right">Call Me by Your Name</span>
          </h1>
        </div>
        <ul className="container-card Boy">
          {error ? (
            <p>Error loading audio file</p>
          ) : (
            <>
              {boy.map((item) => (
                <Card
                  key={item.id}
                  musicData={item}
                  play={togglePlay}
                  currentUrl={currentUrl}
                />
              ))}
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default MusicPlayer;
