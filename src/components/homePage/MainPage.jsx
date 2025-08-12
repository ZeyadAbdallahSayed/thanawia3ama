import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import workAlarmFile from "./audios/loud_alarm_sound.mp3"; // Work session end
import breakAlarmFile from "./audios/iphone_alarm.mp3";    // Break end

// Pomodoro Timer Component
const PomodoroCard = ({ workMinutes, shortBreakMinutes, longBreakMinutes }) => {
  const [time, setTime] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [breakLength, setBreakLength] = useState(shortBreakMinutes * 60);

  const workAlarmRef = useRef(new Audio(workAlarmFile));
  const breakAlarmRef = useRef(new Audio(breakAlarmFile));

  useEffect(() => {
    let timer = null;

    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      if (!isBreak) {
        workAlarmRef.current.play();
        setTime(breakLength);
        setIsBreak(true);
        setIsRunning(true); 
      } else {
        breakAlarmRef.current.play();
        setTime(workMinutes * 60);
        setIsBreak(false);
        setIsRunning(false);
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, time, isBreak, breakLength, workMinutes]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-zinc-400 h-[25rem] rounded-2xl mt-6 flex flex-col items-center p-4 text-white" style={{ width: "280px" }}>
      <h1 className="text-[120px] font-[fantasy] text-white">{formatTime(time)}</h1>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="text-xl text-black font-[fantasy] p-2 w-[16rem] rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500"
      >
        {isRunning ? "Pause" : isBreak ? "Resume Break" : "Start Session"}
      </button>

      <div className="flex items-center gap-5 mt-10 w-full">
        <button
          onClick={() => {
            setBreakLength(shortBreakMinutes * 60);
            setTime(shortBreakMinutes * 60);
            setIsBreak(true);
            setIsRunning(true);
          }}
          className="flex flex-col p-2 rounded-xl border-2 hover:bg-transparent hover:scale-110 shadow-xl transition-all duration-500 w-1/2"
        >
          <h1 className="text-lg font-[fantasy] font-light text-black">Short Break</h1>
          <span className="text-xs">{shortBreakMinutes} Minutes</span>
        </button>

        <button
          onClick={() => {
            setBreakLength(longBreakMinutes * 60);
            setTime(longBreakMinutes * 60);
            setIsBreak(true);
            setIsRunning(true);
          }}
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
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  const dayName = dayNames[time.getDay()];
  const rawHour = time.getHours();
  const ampm = rawHour >= 12 ? "PM" : "AM";
  const hour = String(rawHour % 12 || 12).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");

  const [videoUrl, setVideoUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("https://www.youtube.com/embed/ON7DQ9a65E8");

  const handleLoadVideo = () => {
    const videoId = videoUrl.split("v=")[1]?.split("&")[0];
    if (videoId) setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
  };

  // Task Planner State
  const [tasks, setTasks] = useState([]);
  const [achievedTasks, setAchievedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const completeTask = (index) => {
    const taskToComplete = tasks[index];
    setTasks(tasks.filter((_, i) => i !== index));
    setAchievedTasks([...achievedTasks, taskToComplete]);
  };

  const clearAchievedTasks = () => {
    setAchievedTasks([]);
  };

  return (
    <div className="bg-slate-300 w-full h-screen">
      <div className="container mx-auto px-4 flex flex-row items-start justify-end w-full">
        <div className="container mx-auto px-4 flex flex-col">
          {/* Navbar */}
          <div className="w-5/5 mt-5">
            <div className="flex flex-row items-center justify-around gap-6 p-2 rounded-2xl border-2 px-4">
              <Link to="/WelcomePage">Home</Link>
              <div><span className="border-l-4"></span></div>
              <Link to="/">Share</Link>
              <div><span className="border-l-4"></span></div>
              <div>{dayName} {hour}:{minutes} {ampm}</div>
            </div>

            {/* YouTube Player */}
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
                <input
                  type="text"
                  placeholder="Paste YouTube video link here..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                />
                <button
                  onClick={handleLoadVideo}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Load
                </button>
              </div>
            </div>

            {/* Task Planner */}
            <div className="bg-zinc-800 h-[14rem] rounded-2xl mt-14  flex flex-col p-4 text-white w-full">
              <h1 className="mb-2">Task Planner</h1>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter a task..."
                  className="border rounded-lg p-2 text-black flex-1"
                />
                <button
                  onClick={addTask}
                  className="bg-orange-800 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  +
                </button>
              </div>
              <ul className="overflow-auto flex-1">
                {tasks.length === 0 ? (
                  <li className="text-gray-400 text-sm">No pending tasks</li>
                ) : (
                  tasks.map((task, i) => (
                    <li key={i} className="flex justify-between items-center mb-1">
                      <span>{task}</span>
                      <button
                        onClick={() => completeTask(i)}
                        className="text-green-400 hover:underline"
                      >
                        Done
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="mt-[90px] mx-auto px-4 flex flex-col items-end justify-end gap-8 w-2/3">
          <div className="flex items-center justify-center h-[22.75rem] gap-7">
            <PomodoroCard workMinutes={25} shortBreakMinutes={5} longBreakMinutes={10} />
            <PomodoroCard workMinutes={50} shortBreakMinutes={10} longBreakMinutes={15} />
          </div>
          <div className="bg-zinc-800 h-[14rem] rounded-2xl mt-4 flex flex-col p-4 text-white w-full">
            <div className="flex justify-between items-center mb-2">
              <h1>Achieved Tasks</h1>
              <button
                onClick={clearAchievedTasks}
                className="border-2 rounded-[50px] border-red-600 px-3 py-1 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                Clear
              </button>
            </div>
            <ul className="overflow-auto flex-1">
              {achievedTasks.length === 0 ? (
                <li className="text-gray-400 text-sm">No achieved tasks</li>
              ) : (
                achievedTasks.map((task, i) => <li key={i}>{task}</li>)
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
