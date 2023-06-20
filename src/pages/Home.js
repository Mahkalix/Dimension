import React from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import "../style/Home.css";
import Main from "../components/main";

const Home = () => {
  const token = localStorage.getItem("token");

  return (
    <>
      <Header />
      {token && <Main />}
      <Footer />
    </>
  );
};

export default Home;
