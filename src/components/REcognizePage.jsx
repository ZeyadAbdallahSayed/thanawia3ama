import React, { useState, useEffect } from "react";
import { backgroundd0 } from "../images";
import { useNavigate } from "react-router-dom";

const RecognizePage = () => {
  const [name, setName] = useState("");
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigate = useNavigate();

    // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src = backgroundd0;
    img.onload = () => setBgLoaded(true);
  }, []);


  // ✅ If user already saved, skip this page
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      navigate("/WelcomePage", { state: { userName: savedName } });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Load or create users list
    const users = JSON.parse(localStorage.getItem("admin-users") || "[]");

    // Check if user already exists
    let user = users.find(
      (u) => u.userName.toLowerCase() === name.toLowerCase()
    );

    if (!user) {
      user = { id: Date.now(), userName: name };
      users.push(user);
      localStorage.setItem("admin-users", JSON.stringify(users));
    }

    // Save current logged-in user
    localStorage.setItem("userName", user.userName);
    localStorage.setItem("userId", user.id);

    navigate("/WelcomePage", { state: { userName: user.userName } });
  };

    if (!bgLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading...
      </div>
    );
  }


  return (
      <div
      className="h-screen flex items-center justify-center bg-cover bg-center overflow-auto"
style={{ backgroundImage: `url(${backgroundd0})` }}    >
      <div className="flex flex-col items-center justify-center gap-5 mx-auto -mt-38 bg-transparent rounded-xl w-1/2 z-[10] p-20 shadow-2xl">
        <h1 className="text-4xl text-white font-[fantasy]">Thanawia 3ama Organizer</h1>
        <h2 className="text-3xl text-zinc-800 font-[fantasy]">Welcome Hero...</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="text-l text-black font-[fantasy] p-3 w-[16rem] rounded-xl mt-6 border-none outline-none"
        />
        <button type="submit" className="text-xl text-black font-[fantasy] p-2 w-[16rem] rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500 hover:shadow-xl">
          Get In
        </button>
      </form>
    </div>
    </div>
  );
};

export default RecognizePage;





