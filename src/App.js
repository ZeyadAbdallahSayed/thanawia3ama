import React from "react";
import { Routes, Route } from "react-router-dom";
import REcognizePage from "./components/REcognizePage";
import WelcomePage from "./components/WelcomePage";
import MainPage from "./components/homePage/MainPage"
import AdminUsers from "./components/AdminUsers"
import MuslimMainPage from "./components/homePage/MuslimMainPage"
import "./index.css"

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<REcognizePage />} />
        <Route path="/WelcomePage" element={<WelcomePage />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/muslimmainpage" element={<MuslimMainPage />} />
        <Route path="/admin-users" element={<AdminUsers />} /> {/* ✅ Hidden */}
      </Routes>
  );
};

export default App;
