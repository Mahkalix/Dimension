import React, { useRef, useState, useEffect } from "react";
import Card from "./card.js";
import data from "../data/datamusic.json";
// import Girl from "../assets/girl.jpg";
// import Boy from "../assets/boy.jpg";
import "../style/musicplayer.css";
import Volume from "../components/handlevolume.js";

function MusicPlayer() {
  const audioRef = useRef(new Audio());
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch((error) => {
        setError(true);
        console.error("Error playing audio:", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = (url) => {
    if (currentUrl === url) {
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(true);
      setCurrentUrl(url);
    }
    audioRef.current.src = url;
  };

  const boy = data.filter((item) => item.categorie === "boy");
  const girl = data.filter((item) => item.categorie === "girl");

  return (
    <>
      <Volume audioRef={audioRef} />
      <div className="container-lofi">
        <div>
          <h1 className="title-lofi girl">Dickinson</h1>
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
                  play={() => togglePlay(item.url)}
                  isPlaying={isPlaying && currentUrl === item.url}
                />
              ))}
            </>
          )}
        </ul>
      </div>

      <div className="container-lofi">
        <div>
          <h1 className="title-lofi boy">Cmbyn</h1>
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
                  play={() => togglePlay(item.url)}
                  isPlaying={isPlaying && currentUrl === item.url}
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
