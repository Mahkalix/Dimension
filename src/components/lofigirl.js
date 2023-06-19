import React from "react";
import "../style/lofi.css";
import Girl from "../assets/girl.jpg";
import MusicPlayer from "./musicplayergirl.js";

const lofigirl = () => {
  return (
    <div className="container-lofi">
      <a>
        <h1 className="title-lofi girl">
          <img className="lofilogo" src={Girl} alt="logogirl" />
          Dickinson
        </h1>
      </a>
      <ul className="container-card Girl">
        <MusicPlayer />
      </ul>
    </div>
  );
};

export default lofigirl;
