import React from "react";
import { Routes, Route } from "react-router-dom";
import REcognizePage from "./components/REcognizePage";
import WelcomePage from "./components/WelcomePage";
import MainPage from "./components/homePage/MainPage"
import "./index.css"

const App = () => {
  return (
      <Routes>
        {/* First page */}
        <Route path="/" element={<REcognizePage />} />

        {/* Second page */}
        <Route path="/WelcomePage" element={<WelcomePage />} />

        {/* third page */}
        <Route path="/mainpage" element={<MainPage/>}></Route>
      </Routes>
  );
};

export default App;
