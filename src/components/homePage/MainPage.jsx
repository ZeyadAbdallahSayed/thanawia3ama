// import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { GoTrash } from "react-icons/go";
// import { AiOutlineEdit } from "react-icons/ai";
// import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
// import workAlarmFile from "./audios/loud_alarm_sound.mp3";
// import breakAlarmFile from "./audios/iphone_alarm.mp3";

// // Pomodoro Timer Component
// const PomodoroCard = ({ workMinutes, shortBreakMinutes, longBreakMinutes }) => {
//   const [time, setTime] = useState(workMinutes * 60);
//   const [isRunning, setIsRunning] = useState(false);
//   const [isBreak, setIsBreak] = useState(false);
//   const [breakLength, setBreakLength] = useState(shortBreakMinutes * 60);
//   const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

//   const workAlarmRef = useRef(new Audio(workAlarmFile));
//   const breakAlarmRef = useRef(new Audio(breakAlarmFile));
//   const wakeLockRef = useRef(null);

//   const requestWakeLock = async () => {
//     try {
//       if ("wakeLock" in navigator) {
//         wakeLockRef.current = await navigator.wakeLock.request("screen");
//       }
//     } catch (err) {
//       console.error("Wake Lock error:", err);
//     }
//   };

//   const releaseWakeLock = async () => {
//     try {
//       if (wakeLockRef.current) {
//         await wakeLockRef.current.release();
//         wakeLockRef.current = null;
//       }
//     } catch (err) {
//       console.error("Error releasing wake lock:", err);
//     }
//   };

//   useEffect(() => {
//     let timer = null;
//     if (isRunning && time > 0) {
//       timer = setInterval(() => setTime((prev) => prev - 1), 1000);
//       requestWakeLock();
//     } else if (time === 0 && !isAlarmPlaying) {
//       if (!isBreak) {
//         workAlarmRef.current.play();
//       } else {
//         breakAlarmRef.current.play();
//       }
//       setIsAlarmPlaying(true);
//       setIsRunning(false);
//       releaseWakeLock();
//     }
//     return () => clearInterval(timer);
//   }, [isRunning, time, isBreak, isAlarmPlaying]);

//   useEffect(() => {
//     return () => releaseWakeLock();
//   }, []);

//   const formatTime = (seconds) => {
//     const m = String(Math.floor(seconds / 60)).padStart(2, "0");
//     const s = String(seconds % 60).padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   const handleButtonClick = () => {
//     if (isAlarmPlaying) {
//       const alarm = isBreak ? breakAlarmRef.current : workAlarmRef.current;
//       alarm.pause();
//       alarm.currentTime = 0;
//       setIsAlarmPlaying(false);
//       if (!isBreak) {
//         setTime(breakLength);
//         setIsBreak(true);
//         setIsRunning(true);
//       } else {
//         setTime(workMinutes * 60);
//         setIsBreak(false);
//         setIsRunning(false);
//       }
//     } else {
//       setIsRunning(!isRunning);
//     }
//   };

//   return (
//     <div className="bg-zinc-400 h-[25rem] rounded-2xl mt-6 flex flex-col items-center p-4 text-white" style={{ width: "280px" }}>
//       <h1 className="text-[120px] font-[fantasy] text-white">{formatTime(time)}</h1>
//       <button onClick={handleButtonClick} className="text-xl text-black font-[fantasy] p-2 w-[16rem] rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500">
//         {isAlarmPlaying ? "Stop" : isRunning ? "Pause" : isBreak ? "Resume Break" : "Start Session"}
//       </button>
//       <div className="flex items-center gap-5 mt-10 w-full">
//         <button
//           onClick={() => {
//             setBreakLength(shortBreakMinutes * 60);
//             setTime(shortBreakMinutes * 60);
//             setIsBreak(true);
//             setIsRunning(true);
//           }}
//           className="flex flex-col p-2 rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500 w-1/2"
//         >
//           <h1 className="text-lg font-[fantasy] font-light text-black">Short Break</h1>
//           <span className="text-xs">{shortBreakMinutes} Minutes</span>
//         </button>
//         <button
//           onClick={() => {
//             setBreakLength(longBreakMinutes * 60);
//             setTime(longBreakMinutes * 60);
//             setIsBreak(true);
//             setIsRunning(true);
//           }}
//           className="flex flex-col p-2 rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500 w-1/2"
//         >
//           <h1 className="text-lg font-[fantasy] font-light text-black">Long Break</h1>
//           <span className="text-xs">{longBreakMinutes} Minutes</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// const MainPage = () => {
//   const [copied, setCopied] = useState(false);

//   const handleShare = () => {
//     const link = window.location.origin;
//     navigator.clipboard.writeText(link).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1000);
//     });
//   };

//   const [time, setTime] = useState(new Date());
//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const dayName = dayNames[time.getDay()];
//   const rawHour = time.getHours();
//   const ampm = rawHour >= 12 ? "PM" : "AM";
//   const hour = String(rawHour % 12 || 12).padStart(2, "0");
//   const minutes = String(time.getMinutes()).padStart(2, "0");

//   // YouTube State with localStorage
//   const [videoUrl, setVideoUrl] = useState("");
//   const [embedUrl, setEmbedUrl] = useState(() => localStorage.getItem("embedUrl") || "https://www.youtube.com/embed/ON7DQ9a65E8");

//   useEffect(() => {
//     localStorage.setItem("embedUrl", embedUrl);
//   }, [embedUrl]);

//   const extractYouTubeId = (url) => {
//     try {
//       const parsedUrl = new URL(url);
//       let videoId = "";
//       if (parsedUrl.searchParams.has("v")) videoId = parsedUrl.searchParams.get("v");
//       else if (parsedUrl.hostname.includes("youtu.be")) videoId = parsedUrl.pathname.slice(1);
//       else if (parsedUrl.pathname.startsWith("/shorts/") || parsedUrl.pathname.startsWith("/live/")) videoId = parsedUrl.pathname.split("/")[2];
//       if (videoId.includes("?")) videoId = videoId.split("?")[0];
//       if (videoId.includes("&")) videoId = videoId.split("&")[0];
//       return videoId;
//     } catch {
//       return "";
//     }
//   };

//   const handleLoadVideo = () => {
//     const videoId = extractYouTubeId(videoUrl);
//     if (videoId) {
//       setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
//       setVideoUrl(""); // Clear input after loading
//     }
//   };

//   const motivationalMessages = [
//     "Push yourself, because no one else is going to do it for you.",
//     "Success is the sum of small efforts repeated day in and day out.",
//     "Don’t stop when you’re tired. Stop when you’re done.",
//     "Great things never come from comfort zones.",
//     "The harder you work for something, the greater you’ll feel when you achieve it.",
//     "Wake up with determination, go to bed with satisfaction.",
//     "Dream it. Wish it. Do it.",
//     "Small progress is still progress.",
//     "Your future depends on what you do today.",
//     "Believe in yourself and all that you are."
//   ];

//   const [popupMessage, setPopupMessage] = useState("");
//   const [showPopup, setShowPopup] = useState(false);

//   // Tasks State with localStorage
//   const [tasks, setTasks] = useState(() => {
//     const saved = localStorage.getItem("tasks");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [achievedTasks, setAchievedTasks] = useState(() => {
//     const saved = localStorage.getItem("achievedTasks");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [newTask, setNewTask] = useState("");
//   const [editIndex, setEditIndex] = useState(null);

//   const formatDateTime = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
//   };

//   const addTask = () => {
//     if (newTask.trim()) {
//       let updatedTasks;
//       if (editIndex !== null) {
//         updatedTasks = [...tasks];
//         updatedTasks[editIndex] = { ...updatedTasks[editIndex], text: newTask.trim(), updatedAt: new Date() };
//         setEditIndex(null);
//       } else {
//         updatedTasks = [...tasks, { text: newTask.trim(), createdAt: new Date(), updatedAt: null }];
//       }
//       setTasks(updatedTasks);
//       localStorage.setItem("tasks", JSON.stringify(updatedTasks));
//       setNewTask("");
//     }
//   };

//   const completeTask = (index) => {
//     const taskToComplete = { ...tasks[index], achievedAt: new Date() };
//     const updatedTasks = tasks.filter((_, i) => i !== index);
//     const updatedAchieved = [...achievedTasks, taskToComplete];
//     setTasks(updatedTasks);
//     setAchievedTasks(updatedAchieved);
//     localStorage.setItem("tasks", JSON.stringify(updatedTasks));
//     localStorage.setItem("achievedTasks", JSON.stringify(updatedAchieved));

//     const randomMsg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
//     setPopupMessage(randomMsg);
//     setShowPopup(true);
//   };

//   const deleteTask = (index) => {
//     const updated = tasks.filter((_, i) => i !== index);
//     setTasks(updated);
//     localStorage.setItem("tasks", JSON.stringify(updated));
//   };

//   const editTask = (index) => {
//     setNewTask(tasks[index].text);
//     setEditIndex(index);
//   };

//   const deleteAchievedTask = (index) => {
//     const updated = achievedTasks.filter((_, i) => i !== index);
//     setAchievedTasks(updated);
//     localStorage.setItem("achievedTasks", JSON.stringify(updated));
//   };

//   return (
//     <div className="bg-slate-300 w-full h-screen relative">
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800">Great Job!</h2>
//             <p className="text-lg text-gray-600 mb-6">{popupMessage}</p>
//             <button onClick={() => setShowPopup(false)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Keep Forwarding</button>
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4 flex flex-row items-start justify-end w-full">
//         <div className="container mx-auto px-4 flex flex-col">
//           {/* Navbar */}
//           <div className="w-5/5 mt-5">
//             <div className="flex flex-row items-center justify-around gap-6 p-2 rounded-2xl border-2 px-4">
//               <Link to="/WelcomePage">Home</Link>
//               <div><span className="border-l-4"></span></div>
//               <Link to="#">
//                 <button onClick={handleShare}>Share</button>
//                 {copied && <span className="ml-4 text-green-400 font-semibold"> Link copied! </span>}
//               </Link>
//               <div><span className="border-l-4"></span></div>
//               <div>{dayName} {hour}:{minutes} {ampm}</div>
//             </div>

//             {/* YouTube Player */}
//             <div className="bg-white rounded-2xl h-[23rem] mt-4">
//               <iframe
//                 title="YouTube Video Player"
//                 src={embedUrl}
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
//                 allowFullScreen
//                 className="w-full h-[370px] rounded-2xl"
//               ></iframe>
//               <div className="flex gap-2 mt-2">
//                 <input type="text" placeholder="Paste YouTube video link here..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="border rounded-lg p-2 w-full" />
//                 <button onClick={handleLoadVideo} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Load</button>
//               </div>
//             </div>

//             {/* Task Planner */}
//             <div className="bg-zinc-800 h-[14rem] rounded-2xl mt-14 flex flex-col p-4 text-white w-full">
//               <h1 className="mb-2">Task Planner</h1>
//               <div className="flex gap-2 mb-3">
//                 <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a task..." className="border rounded-lg p-2 text-black flex-1" />
//                 <button onClick={addTask} className="bg-orange-800 text-white px-4 py-2 rounded-lg hover:bg-orange-700">{editIndex !== null ? "Update" : "+"}</button>
//               </div>
//               <ul className="overflow-auto flex-1">
//                 {tasks.length === 0 ? (
//                   <li className="text-gray-400 text-sm">No pending tasks</li>
//                 ) : (
//                   tasks.map((task, i) => (
//                     <li key={i} className="flex flex-col justify-between mb-2 p-2 rounded-lg bg-zinc-700">
//                       <div className="flex justify-between items-center">
//                         <span>{task.text}</span>
//                         <div className="flex gap-2">
//                           <button onClick={() => editTask(i)}><AiOutlineEdit /></button>
//                           <button onClick={() => completeTask(i)} className="text-green-400"><IoCheckmarkDoneCircleOutline /></button>
//                           <button onClick={() => deleteTask(i)} className="text-red-500"><GoTrash /></button>
//                         </div>
//                       </div>
//                       <small className="text-gray-400 text-xs mt-1">
//                         Created: {formatDateTime(task.createdAt)} {task.updatedAt && <> | Updated: {formatDateTime(task.updatedAt)}</>}
//                       </small>
//                     </li>
//                   ))
//                 )}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="mt-[90px] mx-auto px-4 flex flex-col items-end justify-end gap-8 w-2/3">
//           <div className="flex items-center justify-center h-[22.75rem] gap-7">
//             <PomodoroCard workMinutes={25} shortBreakMinutes={5} longBreakMinutes={10} />
//             <PomodoroCard workMinutes={50} shortBreakMinutes={10} longBreakMinutes={15} />
//           </div>

//           <div className="bg-zinc-800 h-[14rem] rounded-2xl mt-4 flex flex-col p-4 text-white w-full">
//             <div className="flex justify-between items-center mb-2">
//               <h1>Achieved Tasks</h1>
//             </div>
//             <ul className="overflow-auto flex-1">
//               {achievedTasks.length === 0 ? (
//                 <li className="text-gray-400 text-sm">No achieved tasks</li>
//               ) : (
//                 achievedTasks.map((task, i) => (
//                   <li key={i} className="flex flex-col justify-between mb-2 p-2 rounded-lg bg-zinc-700">
//                     <div className="flex justify-between items-center">
//                       <span>{task.text}</span>
//                       <button onClick={() => deleteAchievedTask(i)} className="text-red-500"><GoTrash /></button>
//                     </div>
//                     <small className="text-gray-400 text-xs mt-1">Achieved: {formatDateTime(task.achievedAt)}</small>
//                   </li>
//                 ))
//               )}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainPage;


import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import { AiOutlineEdit } from "react-icons/ai";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import workAlarmFile from "./audios/loud_alarm_sound.mp3";
import breakAlarmFile from "./audios/iphone_alarm.mp3";

// Pomodoro Timer Component
const PomodoroCard = ({ workMinutes, shortBreakMinutes, longBreakMinutes }) => {
  const [time, setTime] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [breakLength, setBreakLength] = useState(shortBreakMinutes * 60);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  const workAlarmRef = useRef(new Audio(workAlarmFile));
  const breakAlarmRef = useRef(new Audio(breakAlarmFile));
  const wakeLockRef = useRef(null);

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch (err) {
      console.error("Wake Lock error:", err);
    }
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch (err) {
      console.error("Error releasing wake lock:", err);
    }
  };

  useEffect(() => {
    let timer = null;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
      requestWakeLock();
    } else if (time === 0 && !isAlarmPlaying) {
      const alarm = isBreak ? breakAlarmRef.current : workAlarmRef.current;
      alarm.play();
      setIsAlarmPlaying(true);
      setIsRunning(false);
      releaseWakeLock();
    }
    return () => clearInterval(timer);
  }, [isRunning, time, isBreak, isAlarmPlaying]);

  useEffect(() => {
    return () => releaseWakeLock();
  }, []);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleButtonClick = () => {
    if (isAlarmPlaying) {
      const alarm = isBreak ? breakAlarmRef.current : workAlarmRef.current;
      alarm.pause();
      alarm.currentTime = 0;
      setIsAlarmPlaying(false);

      // Auto-switch
      if (!isBreak) {
        setTime(breakLength);
        setIsBreak(true);
        setIsRunning(true);
      } else {
        setTime(workMinutes * 60);
        setIsBreak(false);
        setIsRunning(true);
      }
    } else {
      setIsRunning(!isRunning);
    }
  };

  const startShortBreak = () => {
    setBreakLength(shortBreakMinutes * 60);
    setTime(shortBreakMinutes * 60);
    setIsBreak(true);
    setIsRunning(true);
  };

  const startLongBreak = () => {
    setBreakLength(longBreakMinutes * 60);
    setTime(longBreakMinutes * 60);
    setIsBreak(true);
    setIsRunning(true);
  };

  return (
    <div
      className="bg-zinc-400 h-[25rem] rounded-2xl mt-6 flex flex-col items-center p-4 text-white"
      style={{ width: "280px" }}
    >
      <h1 className="text-[120px] font-[fantasy] text-white">{formatTime(time)}</h1>
      <button
        onClick={handleButtonClick}
        className="text-xl text-black font-[fantasy] p-2 w-[16rem] rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500"
      >
        {isAlarmPlaying
          ? "Stop"
          : isRunning
          ? "Pause"
          : isBreak
          ? "Resume Break"
          : "Start Session"}
      </button>
      <div className="flex items-center gap-5 mt-10 w-full">
        <button
          onClick={startShortBreak}
          className="flex flex-col p-2 rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500 w-1/2"
        >
          <h1 className="text-lg font-[fantasy] font-light text-black">Short Break</h1>
          <span className="text-xs">{shortBreakMinutes} Minutes</span>
        </button>
        <button
          onClick={startLongBreak}
          className="flex flex-col p-2 rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500 w-1/2"
        >
          <h1 className="text-lg font-[fantasy] font-light text-black">Long Break</h1>
          <span className="text-xs">{longBreakMinutes} Minutes</span>
        </button>
      </div>
    </div>
  );
};

const MainPage = () => {
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState(new Date());
  const [videoUrl, setVideoUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState(() => localStorage.getItem("embedUrl") || "https://www.youtube.com/embed/ON7DQ9a65E8");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks") || "[]"));
  const [achievedTasks, setAchievedTasks] = useState(() => JSON.parse(localStorage.getItem("achievedTasks") || "[]"));
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const tasksEndRef = useRef(null);
  const motivationalMessages = [
    "Push yourself, because no one else is going to do it for you.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Great things never come from comfort zones.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Wake up with determination, go to bed with satisfaction.",
    "Dream it. Wish it. Do it.",
    "Small progress is still progress.",
    "Your future depends on what you do today.",
    "Believe in yourself and all that you are."
  ];

  // Time Update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to newest task
  useEffect(() => {
    if (tasksEndRef.current) tasksEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [tasks]);

  // Auto-close popup
  useEffect(() => {
    if (showPopup) {
      const timeout = setTimeout(() => setShowPopup(false), 6000);
      return () => clearTimeout(timeout);
    }
  }, [showPopup]);

  // Persist YouTube embed
  useEffect(() => localStorage.setItem("embedUrl", embedUrl), [embedUrl]);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = dayNames[time.getDay()];
  const rawHour = time.getHours();
  const ampm = rawHour >= 12 ? "PM" : "AM";
  const hour = String(rawHour % 12 || 12).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");

  const handleShare = () => {
    const link = window.location.origin;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  const extractYouTubeId = (url) => {
    try {
      const parsedUrl = new URL(url);
      let videoId = "";
      if (parsedUrl.searchParams.has("v")) videoId = parsedUrl.searchParams.get("v");
      else if (parsedUrl.hostname.includes("youtu.be")) videoId = parsedUrl.pathname.slice(1);
      else if (parsedUrl.pathname.startsWith("/shorts/") || parsedUrl.pathname.startsWith("/live/"))
        videoId = parsedUrl.pathname.split("/")[2];
      if (!videoId) return "";
      videoId = videoId.split("?")[0].split("&")[0];
      return videoId;
    } catch {
      return "";
    }
  };

  const handleLoadVideo = () => {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
      setVideoUrl("");
      document.getElementById("youtubeInput")?.focus();
    } else {
      alert("Invalid YouTube URL!");
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const addTask = () => {
    if (newTask.trim()) {
      let updatedTasks;
      if (editIndex !== null) {
        updatedTasks = [...tasks];
        updatedTasks[editIndex] = { ...updatedTasks[editIndex], text: newTask.trim(), updatedAt: new Date() };
        setEditIndex(null);
      } else {
        updatedTasks = [...tasks, { text: newTask.trim(), createdAt: new Date(), updatedAt: null }];
      }
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setNewTask("");
    }
  };

  const completeTask = (index) => {
    const taskToComplete = { ...tasks[index], achievedAt: new Date() };
    const updatedTasks = tasks.filter((_, i) => i !== index);
    const updatedAchieved = [...achievedTasks, taskToComplete];
    setTasks(updatedTasks);
    setAchievedTasks(updatedAchieved);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    localStorage.setItem("achievedTasks", JSON.stringify(updatedAchieved));

    const randomMsg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setPopupMessage(randomMsg);
    setShowPopup(true);
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  const editTask = (index) => {
    setNewTask(tasks[index].text);
    setEditIndex(index);
  };

  const deleteAchievedTask = (index) => {
    const updated = achievedTasks.filter((_, i) => i !== index);
    setAchievedTasks(updated);
    localStorage.setItem("achievedTasks", JSON.stringify(updated));
  };

  return (
    <div className="bg-slate-300 w-full h-screen relative">
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Great Job!</h2>
            <p className="text-lg text-gray-600 mb-6">{popupMessage}</p>
            <button onClick={() => setShowPopup(false)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Keep Forwarding</button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 flex flex-row items-start justify-end w-full">
        <div className="container mx-auto px-4 flex flex-col">
          {/* Navbar, YouTube, Tasks... same as original */}
          <div className="w-5/5 mt-5">
            <div className="flex flex-row items-center justify-around gap-6 p-2 rounded-2xl border-2 px-4">
              <Link to="/WelcomePage">Home</Link>
              <div><span className="border-l-4"></span></div>
              <Link to="#">
                <button onClick={handleShare}>Share</button>
                {copied && <span className="ml-4 text-green-400 font-semibold"> Link copied! </span>}
              </Link>
              <div><span className="border-l-4"></span></div>
              <div>{dayName} {hour}:{minutes} {ampm}</div>
            </div>

            <div className="bg-white rounded-2xl h-[23rem] mt-4">
              <iframe
                title="YouTube Video Player"
                src={embedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-[370px] rounded-2xl"
              ></iframe>
              <div className="flex gap-2 mt-2">
                <input id="youtubeInput" type="text" placeholder="Paste YouTube video link here..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="border rounded-lg p-2 w-full" />
                <button onClick={handleLoadVideo} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Load</button>
              </div>
            </div>

            <div className="bg-zinc-800 h-[14rem] rounded-2xl mt-14 flex flex-col p-4 text-white w-full">
              <h1 className="mb-2">Task Planner</h1>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a task..." className="border rounded-lg p-2 text-black flex-1" />
                <button onClick={addTask} className="bg-orange-800 text-white px-4 py-2 rounded-lg hover:bg-orange-700">{editIndex !== null ? "Update" : "+"}</button>
              </div>
              <ul className="overflow-auto flex-1">
                {tasks.length === 0 ? (
                  <li className="text-gray-400 text-sm">No pending tasks</li>
                ) : (
                  tasks.map((task, i) => (
                    <li key={i} className="flex flex-col justify-between mb-2 p-2 rounded-lg bg-zinc-700" ref={i === tasks.length - 1 ? tasksEndRef : null}>
                      <div className="flex justify-between items-center">
                        <span>{task.text}</span>
                        <div className="flex gap-2">
                          <button onClick={() => editTask(i)}><AiOutlineEdit /></button>
                          <button onClick={() => completeTask(i)} className="text-green-400"><IoCheckmarkDoneCircleOutline /></button>
                          <button onClick={() => deleteTask(i)} className="text-red-500"><GoTrash /></button>
                        </div>
                      </div>
                      <small className="text-gray-400 text-xs mt-1">
                        Created: {formatDateTime(task.createdAt)} {task.updatedAt && <> | Updated: {formatDateTime(task.updatedAt)}</>}
                      </small>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-[90px] mx-auto px-4 flex flex-col items-end justify-end gap-8 w-2/3">
          <div className="flex items-center justify-center h-[22.75rem] gap-7">
            <PomodoroCard workMinutes={25} shortBreakMinutes={5} longBreakMinutes={10} />
            <PomodoroCard workMinutes={50} shortBreakMinutes={10} longBreakMinutes={15} />
          </div>

          <div className="bg-zinc-800 h-[14rem] rounded-2xl mt-4 flex flex-col p-4 text-white w-full">
            <div className="flex justify-between items-center mb-2">
              <h1>Achieved Tasks</h1>
            </div>
            <ul className="overflow-auto flex-1">
              {achievedTasks.length === 0 ? (
                <li className="text-gray-400 text-sm">No achieved tasks</li>
              ) : (
                achievedTasks.map((task, i) => (
                  <li key={i} className="flex flex-col justify-between mb-2 p-2 rounded-lg bg-zinc-700">
                    <div className="flex justify-between items-center">
                      <span>{task.text}</span>
                      <button onClick={() => deleteAchievedTask(i)} className="text-red-500"><GoTrash /></button>
                    </div>
                    <small className="text-gray-400 text-xs mt-1">Achieved: {formatDateTime(task.achievedAt)}</small>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
