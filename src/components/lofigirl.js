import React from "react";
import "../style/lofi.css";
import LofiGirl from "../assets/lofigirl.png";

const lofigirl = () => {
  return (
    <div className="container-lofi">
      <a target={"_blank"} rel="noreferrer" href="https://youtu.be/jfKfPfyJRdk">
        <h1 className="title-lofi girl">
          <img className="lofilogo" src={LofiGirl} alt="logogirl" />
          Lo-Fi Girl
        </h1>
      </a>
      <ul className="container-card ">
        <li className="card">card</li>
        <li className="card">card</li>
        <li className="card">card</li>
        <li className="card">card</li>
      </ul>
    </div>
  );
};

export default lofigirl;
