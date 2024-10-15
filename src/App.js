import Router from "./router/router.jsx";
import "./style/App.css";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx"
import React from "react";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Router />
      <Footer />
    </div>
  );
};

export default App;
