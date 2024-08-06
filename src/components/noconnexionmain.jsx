import React from "react";
import "../style/noconnexionmain.css";
import MEN from "../assets/png/men.png";
import Linkedin from "../assets/svg/linkedin.svg";
import Github from "../assets/svg/github.svg";

const Noconnexionmain = () => {
  return (
    <>
      <div className="main2">
        <div className="container-social">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <img className="Linkedin" src={Linkedin} alt="LinkedIn" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <img className="Github" src={Github} alt="GitHub" />
          </a>
        </div>
        <div className="container-description">
          <p className="description">
            Stay motivated and focused while working,
          </p>

          <p className="description2">exercising, or meditating.</p>
        </div>

        <div className="container">
          <img src={MEN} className="png" alt="logo" />
        </div>
      </div>
    </>
  );
};

export default Noconnexionmain;
