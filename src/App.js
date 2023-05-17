import Router from "./router/router.js";
import Header from "./components/header.js";
import Footer from "./components/footer.js";
import "./style/App.css";

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
