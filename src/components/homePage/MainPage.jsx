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
//       const alarm = isBreak ? breakAlarmRef.current : workAlarmRef.current;
//       alarm.play();
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

//       // Auto-switch
//       if (!isBreak) {
//         setTime(breakLength);
//         setIsBreak(true);
//         setIsRunning(true);
//       } else {
//         setTime(workMinutes * 60);
//         setIsBreak(false);
//         setIsRunning(true);
//       }
//     } else {
//       setIsRunning(!isRunning);
//     }
//   };

//   const startShortBreak = () => {
//     setBreakLength(shortBreakMinutes * 60);
//     setTime(shortBreakMinutes * 60);
//     setIsBreak(true);
//     setIsRunning(true);
//   };

//   const startLongBreak = () => {
//     setBreakLength(longBreakMinutes * 60);
//     setTime(longBreakMinutes * 60);
//     setIsBreak(true);
//     setIsRunning(true);
//   };

//   return (
//     <div
//       className="bg-zinc-400 h-[26rem] mt-[-.5rem] rounded-2xl grid grid-rows-[auto_1fr_auto] place-items-center p-4 text-white w-[100%] "
//     >
//       <h1 className="text-[120px] font-[fantasy] text-white">{formatTime(time)}</h1>
//       <button
//         onClick={handleButtonClick}
//         className="text-xl text-black font-[fantasy] p-2 w-[16rem] rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500"
//       >
//         {isAlarmPlaying
//           ? "Stop"
//           : isRunning
//           ? "Pause"
//           : isBreak
//           ? "Resume Break"
//           : "Start Session"}
//       </button>
//       <div className="grid grid-cols-2 gap-5 mt-10 w-full">
//         <button
//           onClick={startShortBreak}
//           className="grid p-2 rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500"
//         >
//           <h1 className="text-lg font-[fantasy] font-light text-black">Short Break</h1>
//           <span className="text-xs">{shortBreakMinutes} Minutes</span>
//         </button>
//         <button
//           onClick={startLongBreak}
//           className="grid p-2 rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500"
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
//   const [time, setTime] = useState(new Date());
//   const [videoUrl, setVideoUrl] = useState("");
//   const [embedUrl, setEmbedUrl] = useState(() => localStorage.getItem("embedUrl") || "https://www.youtube.com/embed/ON7DQ9a65E8");
//   const [popupMessage, setPopupMessage] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks") || "[]"));
//   const [achievedTasks, setAchievedTasks] = useState(() => JSON.parse(localStorage.getItem("achievedTasks") || "[]"));
//   const [newTask, setNewTask] = useState("");
//   const [editIndex, setEditIndex] = useState(null);
//   const tasksEndRef = useRef(null);
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

//   // Time Update
//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Scroll to newest task
//   useEffect(() => {
//     if (tasksEndRef.current) tasksEndRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [tasks]);

//   // Auto-close popup
//   useEffect(() => {
//     if (showPopup) {
//       const timeout = setTimeout(() => setShowPopup(false), 6000);
//       return () => clearTimeout(timeout);
//     }
//   }, [showPopup]);

//   // Persist YouTube embed
//   useEffect(() => localStorage.setItem("embedUrl", embedUrl), [embedUrl]);

//   const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const dayName = dayNames[time.getDay()];
//   const rawHour = time.getHours();
//   const ampm = rawHour >= 12 ? "PM" : "AM";
//   const hour = String(rawHour % 12 || 12).padStart(2, "0");
//   const minutes = String(time.getMinutes()).padStart(2, "0");

//   const handleShare = () => {
//     const link = window.location.origin;
//     navigator.clipboard.writeText(link).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1000);
//     });
//   };

//   const extractYouTubeId = (url) => {
//     try {
//       const parsedUrl = new URL(url);
//       let videoId = "";
//       if (parsedUrl.searchParams.has("v")) videoId = parsedUrl.searchParams.get("v");
//       else if (parsedUrl.hostname.includes("youtu.be")) videoId = parsedUrl.pathname.slice(1);
//       else if (parsedUrl.pathname.startsWith("/shorts/") || parsedUrl.pathname.startsWith("/live/"))
//         videoId = parsedUrl.pathname.split("/")[2];
//       if (!videoId) return "";
//       videoId = videoId.split("?")[0].split("&")[0];
//       return videoId;
//     } catch {
//       return "";
//     }
//   };

//   const handleLoadVideo = () => {
//     const videoId = extractYouTubeId(videoUrl);
//     if (videoId) {
//       setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
//       setVideoUrl("");
//       document.getElementById("youtubeInput")?.focus();
//     } else {
//       alert("Invalid YouTube URL!");
//     }
//   };

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
//     <div className="bg-slate-300 w-full h-[1700px] md:h-screen md:overflow-y-hidden relative">
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 grid place-items-center z-50">
//           <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800">Great Job!</h2>
//             <p className="text-lg text-gray-600 mb-6">{popupMessage}</p>
//             <button onClick={() => setShowPopup(false)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Keep Forwarding</button>
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2  gap-4 w-full">
//         <div className="col-span-1 grid grid-rows-1 md:grid-rows-2 gap-6">
//           {/* Navbar */}
//           <div className="w-full mt-5">
//             <div className="grid grid-cols-5 items-center justify-around gap-6 p-2 rounded-2xl border-2 px-8 md:px-4">
//               <Link to="/WelcomePage">Home</Link>
//               <div><span className="border-l-4"></span></div>
//               <Link to="#">
//                 <button onClick={handleShare}>Share</button>
//                 {copied && <span className="ml-4 text-green-400 font-semibold"> Link copied! </span>}
//               </Link>
//               <div><span className="border-l-4"></span></div>
//               <div className=" text-sm md:text-md">{dayName} {hour}:{minutes} {ampm}</div>
//             </div>

//             {/* YouTube */}
//             <div className="bg-white rounded-2xl h-[23rem] mt-4 grid">
//               <iframe
//                 title="YouTube Video Player"
//                 src={embedUrl}
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
//                 allowFullScreen
//                 className="w-full h-[370px] rounded-2xl"
//               ></iframe>
//               <div className="grid grid-cols-[1fr_auto] gap-2 mt-2">
//                 <input id="youtubeInput" type="text" placeholder="Paste YouTube video link here..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="border rounded-lg p-2 w-full" />
//                 <button onClick={handleLoadVideo} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Load</button>
//               </div>
//             </div>

//             {/* Tasks */}
//             <div className="bg-zinc-800 h-[14rem] rounded-2xl mt-14 grid grid-rows-[auto_auto_1fr] p-4 text-white w-full">
//               <h1 className="mb-2">Task Planner</h1>
//               <div className="grid grid-cols-[1fr_auto] gap-2 mb-3">
//                 <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a task..." className="border rounded-lg p-2 text-black" />
//                 <button onClick={addTask} className="bg-orange-800 text-white px-4 py-2 rounded-lg hover:bg-orange-700">{editIndex !== null ? "Update" : "+"}</button>
//               </div>
//               <ul className="overflow-auto">
//                 {tasks.length === 0 ? (
//                   <li className="text-gray-400 text-sm">No pending tasks</li>
//                 ) : (
//                   tasks.map((task, i) => (
//                     <li key={i} className="grid gap-1 mb-2 p-2 rounded-lg bg-zinc-700" ref={i === tasks.length - 1 ? tasksEndRef : null}>
//                       <div className="grid grid-cols-[1fr_auto] items-center">
//                         <span>{task.text}</span>
//                         <div className="grid grid-flow-col gap-2">
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
//                 )
//                 }
//                 </ul>
// </div>
// </div>
// </div>


// <div className="grid grid-rows-1 md:grid-rows-2  gap-8 md:mt-[90px]">
// <div className="grid grid-cols-1 md:grid-cols-2 gap-7 h-[22.75rem] place-items-center mt-[270px] md:mt-0">
// <PomodoroCard workMinutes={25} shortBreakMinutes={5} longBreakMinutes={10} />
// <PomodoroCard workMinutes={50} shortBreakMinutes={10} longBreakMinutes={15} />
// </div>


// <div className="bg-zinc-800 h-[14rem] rounded-2xl md:mt-[-298px] mt-[-670px] grid grid-rows-[auto_1fr] p-4 text-white w-full">
// <div className="flex justify-between items-center mb-2">
// <h1>Achieved Tasks</h1>
// </div>
// <ul className="overflow-auto">
// {achievedTasks.length === 0 ? (
// <li className="text-gray-400 text-sm">No achieved tasks</li>
// ) : (
// achievedTasks.map((task, i) => (
// <li key={i} className="grid gap-1 mb-2 p-2 rounded-lg bg-zinc-700">
// <div className="grid grid-cols-[1fr_auto] items-center">
// <span>{task.text}</span>
// <button onClick={() => deleteAchievedTask(i)} className="text-red-500"><GoTrash /></button>
// </div>
// <small className="text-gray-400 text-xs mt-1">Achieved: {formatDateTime(task.achievedAt)}</small>
// </li>
// ))
// )}
// </ul>
// </div>
// </div>
// </div>
// </div>
// );
// };


// export default MainPage;

import React, { useEffect, useMemo,  useState } from "react";

/*************************
 * Utils
 *************************/
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function useWakeLock(active) {
  useEffect(() => {
    let lock = null;
    async function req() {
      try {
        if (active && "wakeLock" in navigator) {
          lock = await navigator.wakeLock.request("screen");
        }
      } catch (e) {
        // ignore
      }
    }
    req();
    return () => {
      try { lock && lock.release(); } catch {}
    };
  }, [active]);
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

function useDebounced(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

// Parse ANY YouTube link (video / short / live / youtu.be / playlist)
function parseYouTubeUrl(input) {
  if (!input) return { kind: "none" };
  try {
    const url = new URL(input);
    const host = url.hostname.replace("www.", "");
    let videoId = "";
    let list = url.searchParams.get("list") || "";
    let index = url.searchParams.get("index") || "";

    if (host === "youtu.be") {
      videoId = url.pathname.slice(1);
    } else if (url.pathname.startsWith("/watch")) {
      videoId = url.searchParams.get("v") || "";
    } else if (url.pathname.startsWith("/shorts/")) {
      videoId = url.pathname.split("/")[2] || "";
    } else if (url.pathname.startsWith("/live/")) {
      videoId = url.pathname.split("/")[2] || "";
    } else if (url.pathname.startsWith("/playlist")) {
      // playlist only
      list = list || url.searchParams.get("list") || "";
    }

    if (list && !videoId) {
      // playlist only
      const embed = `https://www.youtube.com/embed/videoseries?list=${list}`;
      return { kind: "playlist", embed, videoId: "", list };
    }

    if (videoId) {
      const qs = new URLSearchParams();
      if (list) qs.set("list", list);
      if (index) qs.set("index", index);
      const query = qs.toString();
      const embed = `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ""}`;
      return { kind: list ? "video+playlist" : "video", embed, videoId, list, index };
    }
  } catch {
    // not a URL, maybe a raw ID
    const raw = input.trim();
    if (/^[A-Za-z0-9_-]{6,}$/.test(raw)) {
      return { kind: "video", embed: `https://www.youtube.com/embed/${raw}`, videoId: raw };
    }
  }
  return { kind: "invalid" };
}

/*************************
 * Navbar (time + theme toggle)
 *************************/
function Navbar({ dark, onToggle }) {
  const now = useNow();
  const day = dayNames[now.getDay()];
  const hour12 = ((now.getHours() % 12) || 12).toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/10 dark:supports-[backdrop-filter]:bg-black/20 bg-white/60 dark:bg-black/40 border-b border-white/20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-extrabold tracking-tight text-lg md:text-xl select-none">
          ⚡️ FocusFlow
        </div>
        <div className="flex items-center gap-3 text-sm md:text-base">
          <span className="opacity-80 hidden sm:inline">{now.toLocaleDateString()}</span>
          <span className="font-mono">{day} {hour12}:{min} {ampm}</span>
          <button
            onClick={onToggle}
            className="ml-3 px-3 py-1.5 rounded-xl shadow hover:shadow-lg transition active:scale-[.98] bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}

/*************************
 * YouTube Player + Input
 *************************/
function YouTubePanel({ storedUrl, onChangeUrl, onResolved }) {
  const [raw, setRaw] = useState(storedUrl || "https://www.youtube.com/watch?v=ON7DQ9a65E8");
  const debounced = useDebounced(raw, 500); // "يحمل قبل ما تدوس لود"

  const parsed = useMemo(() => parseYouTubeUrl(debounced), [debounced]);

  // sync up when raw changes
  useEffect(() => {
    if (parsed && parsed.embed && parsed.kind !== "invalid") {
      onChangeUrl(parsed.embed);
      onResolved(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed]);

  const manualLoad = () => {
    const p = parseYouTubeUrl(raw);
    if (p.kind !== "invalid" && p.embed) {
      onChangeUrl(p.embed);
      onResolved(p);
    } else {
      alert("Invalid YouTube link or ID");
    }
  };

  return (
    <div className="rounded-2xl shadow-xl p-4 md:p-6 bg-white/70 dark:bg-white/5 border border-black/5 md:py-10">
      <div className="aspect-video w-full overflow-hidden rounded-xl shadow">
        <iframe
          className="w-full h-full"
          src={parsed.embed || storedUrl}
          title="YouTube Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <input
          id="ytInput"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Paste any YouTube link, video ID, or playlist URL…"
          className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={manualLoad}
          className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 active:scale-[.98]"
        >
          Load
        </button>
      </div>

      {parsed.kind === "playlist" && (
        <p className="mt-2 text-sm opacity-75">Playlist detected (ID: {parsed.list}).</p>
      )}
      {parsed.kind === "video+playlist" && (
        <p className="mt-2 text-sm opacity-75">Video in playlist (video: {parsed.videoId}, list: {parsed.list}{parsed.index ? `, index: ${parsed.index}` : ""}).</p>
      )}
    </div>
  );
}

function PomodoroCard({ label, defaultMinutes, theme = "blue", persistKey }) {
  const [state, setState] = useLocalStorage(persistKey, {
    secs: defaultMinutes * 60,
    running: false,
    isBreak: false,
  });

  const { secs, running, isBreak } = state;
  const [remaining, setRemaining] = useState(secs);
  useEffect(() => setRemaining(secs), [secs]);

  useWakeLock(running);

  // tick
  useEffect(() => {
    let t = null;
    if (running && remaining > 0) {
      t = setInterval(() => setRemaining((r) => r - 1), 1000);
    } else if (remaining === 0) {
      // session finished -> flip
      beep();
      const next = isBreak ? defaultMinutes * 60 : Math.round(defaultMinutes * 0.2) * 60; // short break 20% of session
      setState({ secs: next, running: false, isBreak: !isBreak });
    }
    return () => t && clearInterval(t);
  }, [running, remaining, isBreak, defaultMinutes, setState]);

  // persist when remaining changes (while not finished)
  useEffect(() => {
    if (remaining > 0) setState((s) => ({ ...s, secs: remaining }));
  }, [remaining, setState]);

  const toggle = () => setState((s) => ({ ...s, running: !s.running }));
  const reset = () => setState({ secs: defaultMinutes * 60, running: false, isBreak: false });

  const palette = theme === "teal"
    ? "from-teal-500 to-emerald-600"
    : theme === "purple"
    ? "from-fuchsia-500 to-purple-600"
    : "from-sky-500 to-indigo-600"; // blue default

  return (
    <div className={`rounded-2xl shadow-xl p-5 md:p-6 text-white bg-gradient-to-br ${palette}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold">{label}</h4>
        <span className="px-2 py-0.5 text-xs rounded-full bg-white/20">{isBreak ? "Break" : "Focus"}</span>
      </div>
      <div className="text-center font-mono text-5xl md:text-6xl drop-shadow-md tracking-tight">
        {formatMMSS(remaining)}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={toggle} className="flex-1 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 active:scale-[.98]">{running ? "Pause" : "Start"}</button>
        <button onClick={reset} className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 active:scale-[.98]">Reset</button>
      </div>
    </div>
  );
}

function formatMMSS(total) {
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    o.stop(ctx.currentTime + 0.35);
  } catch {}
}

/*************************
 * Tasks + Popup
 *************************/
function TasksPanel() {
  const [tasks, setTasks] = useLocalStorage("ff_tasks", []);
  const [done, setDone] = useLocalStorage("ff_done", []);
  const [input, setInput] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const messages = useMemo(() => [
   "Push yourself, because no one else is going to do it for you.",
   "Success is the sum of small efforts repeated day in and day out.",
   "Don’t stop when you’re tired. Stop when you’re done.",
   "Great things never come from comfort zones.",
   "The harder you work for something, the greater you’ll feel when you achieve it.",
   "Wake up with determination, go to bed with satisfaction.",
   "Dream it. Wish it. Do it.",
   "Small progress is still progress.",
   "Your future depends on what you do today.",
   "Believe in yourself and all that you are.",
  ], []);

  useEffect(() => {
    let t;
    if (showPopup) t = setTimeout(() => setShowPopup(false), 5000);
    return () => t && clearTimeout(t);
  }, [showPopup]);

  const addTask = () => {
    const t = input.trim();
    if (!t) return;
    setTasks([...tasks, { text: t, createdAt: Date.now() }]);
    setInput("");
  };

  const completeTask = (idx) => {
    const item = tasks[idx];
    setTasks(tasks.filter((_, i) => i !== idx));
    setDone([...done, { ...item, achievedAt: Date.now() }]);
    setShowPopup(true);
  };

  const deleteTask = (idx) => setTasks(tasks.filter((_, i) => i !== idx));
  const deleteDone = (idx) => setDone(done.filter((_, i) => i !== idx));

  return (
    <div className="rounded-2xl shadow-xl p-4 md:p-6 bg-white/70 dark:bg-white/5 border border-black/5">
      <h3 className="font-semibold mb-3">Task Planner</h3>
      <div className="grid grid-cols-[1fr_auto] gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task…"
          className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10"
        />
        <button onClick={addTask} className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Add</button>
      </div>

      <ul className="space-y-2 max-h-56 overflow-auto pr-1">
        {tasks.length === 0 && (
          <li className="text-sm opacity-70">No pending tasks.</li>
        )}
        {tasks.map((t, i) => (
          <li key={i} className="grid grid-cols-[1fr_auto] items-center gap-2 bg-white/60 dark:bg-white/10 rounded-xl px-3 py-2">
            <span>{t.text}</span>
            <div className="flex gap-2">
              <button onClick={() => completeTask(i)} className="px-2 py-1 rounded-lg bg-green-500 text-white">Done</button>
              <button onClick={() => deleteTask(i)} className="px-2 py-1 rounded-lg bg-rose-500 text-white">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <h4 className="mt-5 font-semibold">Achieved</h4>
      <ul className="space-y-2 max-h-40 overflow-auto pr-1">
        {done.length === 0 && <li className="text-sm opacity-70">No achieved tasks yet.</li>}
        {done.map((t, i) => (
          <li key={i} className="grid grid-cols-[1fr_auto] items-center gap-2 bg-green-500/15 rounded-xl px-3 py-2">
            <span>{t.text}</span>
            <button onClick={() => deleteDone(i)} className="px-2 py-1 rounded-lg bg-rose-500 text-white">Remove</button>
          </li>
        ))}
      </ul>

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50 animate-fade">
          <div className="bg-white dark:bg-zinc-900 text-center rounded-2xl p-6 shadow-2xl w-[min(90vw,420px)]">
            <h4 className="text-xl font-bold mb-2">Great Job! 🎉</h4>
            <p className="opacity-80 mb-4">{messages[Math.floor(Math.random()*messages.length)]}</p>
            <button onClick={() => setShowPopup(false)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Keep Going</button>
          </div>
        </div>
      )}
    </div>
  );
}

/*************************
 * Main Page
 *************************/
export default function MainPage() {
  const [dark, setDark] = useLocalStorage("ff_dark", true);
  const [embedUrl, setEmbedUrl] = useLocalStorage("ff_embed", "https://www.youtube.com/embed/ON7DQ9a65E8");
  const [lastParsed, setLastParsed] = useState({ kind: "video", videoId: "ON7DQ9a65E8" });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !!dark);
  }, [dark]);

  return (
    <div className={`min-h-screen transition-colors ${dark ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white" : "bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900"}`}>
      <Navbar dark={dark} onToggle={() => setDark((v) => !v)} />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-28 grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-6">
        {/* Left column: YouTube + Transcript */}
        <div className="space-y-6">
          <YouTubePanel
            storedUrl={embedUrl}
            onChangeUrl={(u) => setEmbedUrl(u)}
            onResolved={(p) => setLastParsed(p)}
          />
          {/* <TranscriptPanel videoId={lastParsed.videoId} /> */}
        </div>

        {/* Right column: Timers + Tasks */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PomodoroCard label="Focus 25" defaultMinutes={25} theme="purple" persistKey="ff_timer_25" />
            <PomodoroCard label="Deep 50" defaultMinutes={50} theme="teal" persistKey="ff_timer_50" />
          </div>
          <TasksPanel />
        </div>
      </main>
    </div>
  );
}
