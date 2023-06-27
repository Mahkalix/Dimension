// import React, { useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import "../style/Home.css";
import Main from "../components/main";
import NoConnexionMain from "../components/noconnexionmain";

const Home = () => {
  const token = localStorage.getItem("token");

  return (
    <>
      <Header />
      {!token && <NoConnexionMain />}
      {token && <Main />}
      <Footer />
    </>
  );
};

export default Home;
