import React, { useEffect, useState } from "react";
import { background1 } from "../images";
import { useLocation, useNavigate, Link } from "react-router-dom";

const WelcomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [time, setTime] = useState(new Date());
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // حالة عرض البوب أب

  useEffect(() => {
    const fromState = location.state?.userName;
    const fromStorage = localStorage.getItem("userName");

    if (fromState) {
      setUserName(fromState);
      localStorage.setItem("userName", fromState);
    } else if (fromStorage) {
      setUserName(fromStorage);
    } else {
      navigate("/");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = background1;
    img.onload = () => setBgLoaded(true);
  }, []);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = dayNames[time.getDay()];

  let hour = time.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  const minutes = String(time.getMinutes()).padStart(2, "0");

  const handleChangeName = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handlePopupChoice = (path) => {
    setShowPopup(false); // إخفاء البوب أب
    navigate(path); // توجيه المستخدم حسب الاختيار
  };

  if (!bgLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-auto">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1]"
        style={{ backgroundImage: `url('${background1}')` }}
      ></div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center gap-8 mx-auto mt-7 sm:mt-24 p-6 sm:p-12 md:px-20 w-11/12 sm:w-3/4 md:w-1/2 bg-black/0 backdrop-blur-md rounded-xl z-[10] shadow-lg">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-slate-100 font-fantasy text-center">
          Welcome{" "}
          <span className="text-4xl sm:text-5xl md:text-6xl text-slate-700 font-fantasy">
            {userName}
          </span>
          !!
        </h2>

        <div className="flex flex-col items-center">
          <p className="text-lg sm:text-xl md:text-xl font-fantasy text-gray-800">
            IT'S
          </p>
          <h1 className="text-[80px] sm:text-[100px] md:text-[140px] font-fantasy text-white">
            {hour}:{minutes}{" "}
            <span className="text-3xl sm:text-4xl md:text-5xl">{ampm}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-xl font-fantasy text-gray-800">
            Time For Achieving
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-col bg-neutral-900 p-2 justify-center items-center rounded-md text-white w-16 h-16">
              <h1 className="font-fantasy">{dayName}</h1>
              <h2 className="font-fantasy">{time.getDate()}</h2>
            </div>

            <Link
              to="#"
              className="flex items-center justify-center text-lg sm:text-xl md:text-xl text-green-950 font-fantasy w-full sm:w-64 md:w-72 rounded-xl border-2 hover:bg-transparent hover:scale-105 shadow-xl transition-all duration-500 hover:shadow-xl p-4"
            onClick={() => setShowPopup(true)}
            >
              Success Starts Here
            </Link>
          </div>

          <button
            onClick={handleChangeName}
            className="text-lg sm:text-xl md:text-xl text-black font-fantasy p-2 w-full sm:w-80 md:w-96 rounded-xl border-2 hover:bg-transparent hover:scale-105 shadow-xl transition-all duration-500 hover:shadow-xl"
          >
            Change Name
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[50]">
          <div className="bg-white rounded-xl p-8 max-w-md w-11/12 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-10">Are You Muslim?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handlePopupChoice("/MuslimMainPage")}
                className="bg-blue-500 text-white py-2 px-10 rounded hover:bg-blue-600 transition"
              >
Yes              </button>
              <button
                onClick={() => handlePopupChoice("/MainPage")}
                className="bg-green-500 text-white py-2 px-10 rounded hover:bg-green-600 transition"
              >
No              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
