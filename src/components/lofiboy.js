import React from "react";
import "../style/lofi.css";
import Boy from "../assets/boy.jpg";
import MusicPlayer from "./musicplayerboy.js";

const lofiboy = () => {
  return (
    <div className="container-lofi">
      <a>
        <h1 className="title-lofi boy">
          <img className="lofilogo" src={Boy} alt="lofiboy" />
          Cmbyn
        </h1>
      </a>
      <ul className="container-card Boy">
        <MusicPlayer />
      </ul>
    </div>
  );
};

export default lofiboy;
