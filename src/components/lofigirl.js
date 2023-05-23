import React from "react";
import "../style/lofi.css";
import LofiGirl from "../assets/lofigirl.png";
import MusicPlayer from "../components/musicplayer.js";

const lofigirl = () => {
  return (
    <div className="container-lofi">
      <a target={"_blank"} rel="noreferrer" href="https://youtu.be/jfKfPfyJRdk">
        <h1 className="title-lofi girl">
          <img className="lofilogo" src={LofiGirl} alt="logogirl" />
          Lo-Fi Girl
        </h1>
      </a>
      <ul className="container-card">
        <MusicPlayer />
      </ul>
    </div>
  );
};

export default lofigirl;
