import React from "react";
import "../style/footer.css";

const footer = () => {
  return (
    <footer>
      <h1 className="text-footer">
        Made by &nbsp;
        <a
          href="https://github.com/Mahkalix"
          target={"_blank"}
          className="name-footer"
        >
          Maxence Badin-Léger
        </a>
      </h1>
    </footer>
  );
};

export default footer;
