import React from "react";
import "../style/footer.css";

const footer = () => {
  return (
    <footer>
      <h1 className="text-footer">
        © Copyright 2023 -
        <a
          href="https://github.com/Mahkalix"
          target={"_blank"}
          rel="noreferrer"
          className="name-footer"
        >
          Maxence Badin-Léger
        </a>
      </h1>
    </footer>
  );
};

export default footer;
