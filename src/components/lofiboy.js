import React from "react";
import "../style/lofi.css";
import LofiBoy from "../assets/lofiboy.png";
import MusicPlayer from "../components/musicplayer.js";

const lofiboy = () => {
  return (
    <div className="container-lofi">
      <a
        target={"_blank"}
        rel="noreferrer"
        href="https://www.youtube.com/watch?v=MVPTGNGiI-4&ab_channel=LofiGirl"
      >
        <h1 className="title-lofi boy">
          <img className="lofilogo" src={LofiBoy} alt="lofiboy" />
          Lo-Fi Boy
        </h1>
      </a>
      <ul className="container-card">
        <MusicPlayer />
      </ul>
    </div>
  );
};

export default lofiboy;
