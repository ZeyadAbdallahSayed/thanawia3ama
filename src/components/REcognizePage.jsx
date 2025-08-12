import React, { useState } from 'react';
import { backgroundd0 } from "../images";
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

const REcognizePage = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate(); // ✅ Create navigate function

  const getUserName = () => {
    console.log("User Name:", userName);
    // Pass username as state to WelcomePage
    navigate("/WelcomePage", { state: { userName } });
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1]"
        style={{ backgroundImage: `url('${backgroundd0}')` }}
      ></div>

      <div className="flex flex-col items-center justify-center gap-5 mx-auto mt-44 bg-transparent rounded-xl w-1/2 z-[10] p-20 shadow-2xl">
        <h1 className="text-4xl text-white font-[fantasy]">Thanawia 3ama Organizer</h1>
        <h2 className="text-3xl text-zinc-800 font-[fantasy]">Welcome Hero...</h2>

        {/* Input field */}
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="text-l text-black font-[fantasy] p-3 w-[16rem] rounded-xl mt-6 border-none outline-none"
        />

        {/* Navigate on click */}
        <button
          className="text-xl text-black font-[fantasy] p-2 w-[16rem] rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500 hover:shadow-xl"
          onClick={getUserName}
        >
          Get In
        </button>
      </div>
    </div>
  );
};

export default REcognizePage;
