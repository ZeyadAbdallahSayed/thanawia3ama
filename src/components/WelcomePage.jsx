import React, { useEffect, useState } from "react";
import { background1 } from "../images";
import { useLocation, Link } from "react-router-dom";

const WelcomePage = () => {
  const location = useLocation();

  // ✅ Get from state first, fallback to localStorage, then "Guest"
  const userName =
    location.state?.userName ||
    localStorage.getItem("userName") ||
    "Guest";

  const [time, setTime] = useState(new Date());
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = background1;
    img.onload = () => setBgLoaded(true);
  }, []);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  const dayName = dayNames[time.getDay()];

  // ✅ Convert to 12-hour format
  let hour = time.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert '0' to '12'
  const minutes = String(time.getMinutes()).padStart(2, "0");

  if (!bgLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1]"
        style={{ backgroundImage: `url('${background1}')` }}
      ></div>

      <div className="flex flex-col items-center justify-center gap-8 mx-auto mt-24 rounded-xl w-1/2 z-[10] p-20 bg-black/0 backdrop-blur-md shadow-lg">
        <h2 className="text-4xl text-slate-100 font-[fantasy]">
          Welcome{" "}
          <span className="text-6xl text-slate-700 font-[fantasy]">
            {userName}
          </span>
          !!
        </h2>

        <div className="flex flex-col items-center">
          <p className="text-xl font-bold text-gray-800">IT'S</p>
          <h1 className="text-[140px] font-[fantasy] text-white">
            {hour}:{minutes} <span className="text-5xl">{ampm}</span>
          </h1>
          <p className="text-xl font-bold text-gray-800">Time For Achieving</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col bg-neutral-900 p-2 justify-center items-center rounded-md text-white">
            <h1>{dayName}</h1>
            <h2>{time.getDate()}</h2>
          </div>
          <Link
            to="/mainpage"
            className="flex items-center justify-center text-xl text-green-950 font-[fantasy] w-[16rem] rounded-xl border-2 hover:bg-transparent hover:scale-105 shadow-xl transition-all duration-500 hover:shadow-xl p-4"
          >
            Success Starts Here
          </Link>
        </div>
      </div>
    </div>
  );
};


export default WelcomePage;
