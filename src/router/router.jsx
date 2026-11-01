import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../legacy-pages/Home";
import Accueil from "../legacy-pages/Accueil";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Accueil" element={<Accueil />} />
    </Routes>
  );
};

export default Router;

