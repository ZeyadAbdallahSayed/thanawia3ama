import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PrayerWidget from "./PrayerWidget.jsx"; 

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
      } catch {}
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

/*************************
 * Navbar
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
 * YouTube Panel
 *************************/
function YouTubePanel({ storedUrl, onChangeUrl, onResolved }) {
  const [raw, setRaw] = useState(storedUrl || "");

  const debounced = useDebounced(raw, 500);
  const parsed = useMemo(() => parseYouTubeUrl(debounced), [debounced]);

  useEffect(() => {
    if (parsed && parsed.embed && parsed.kind !== "invalid") {
      onChangeUrl(parsed.embed);
      onResolved(parsed);
    }
  }, [parsed, onChangeUrl, onResolved]);

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
      list = list || url.searchParams.get("list") || "";
    }

    if (list && !videoId) {
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
  } catch {}
  const raw = input.trim();
  if (/^[A-Za-z0-9_-]{6,}$/.test(raw)) {
    return { kind: "video", embed: `https://www.youtube.com/embed/${raw}`, videoId: raw };
  }
  return { kind: "invalid" };
}

/*************************
 * Pomodoro Card
 *************************/
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

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const t = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(t);
  }, [running, remaining]);

  useEffect(() => {
    if (remaining !== 0) return;
    beep(isBreak ? 600 : 880);
    const next = isBreak ? defaultMinutes * 60 : Math.round(defaultMinutes * 0.2) * 60;
    setState({ secs: next, running: false, isBreak: !isBreak });
  }, [remaining, isBreak, defaultMinutes, setState]);

  useEffect(() => {
    if (remaining > 0) setState(s => ({ ...s, secs: remaining }));
  }, [remaining, setState]);

  const toggle = () => setState(s => ({ ...s, running: !s.running }));
  const reset = () => setState({ secs: defaultMinutes * 60, running: false, isBreak: false });

  const palette = theme === "teal" ? "from-teal-500 to-emerald-600" : theme === "purple" ? "from-fuchsia-500 to-purple-600" : "from-sky-500 to-indigo-600";

  return (
    <div className={`rounded-2xl shadow-xl p-5 md:p-6 md:px-10 px-11 text-white bg-gradient-to-br ${palette}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold">{label}</h4>
        <span className="px-2 py-0.5 text-xs rounded-full bg-white/20">{isBreak ? "Break" : "Focus"}</span>
      </div>
      <div className="text-center font-mono text-5xl md:text-6xl drop-shadow-md tracking-tight">{formatMMSS(remaining)}</div>
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

function beep(freq = 880) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
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
 * Tasks Panel
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
        {tasks.length === 0 && (<li className="text-sm opacity-70">No pending tasks.</li>)}
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
// MainPage.jsx
// نخليها كومبوننت منفصل
// باقي الأكواد (Navbar, YouTubePanel, PomodoroCard, TasksPanel)...

export default function MainPage() {
  const [dark, setDark] = useLocalStorage("ff_dark", true);
  const [embedUrl, setEmbedUrl] = useLocalStorage("ff_embed", "");
  const [lastParsed, setLastParsed] = useState({ kind: "video" });
  const [appPaused, setAppPaused] = useState(false);

  const [welcomePopup, setWelcomePopup] = useState(true);


  useEffect(() => {
    document.documentElement.classList.toggle("dark", !!dark);
  }, [dark]);

  const pauseApp = () => setAppPaused(true);
  const resumeApp = () => setAppPaused(false);

  return (
    <div
      className={`min-h-screen transition-colors ${
        dark
          ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white"
          : "bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900"
      }`}
    >
      <Navbar dark={dark} onToggle={() => setDark((v) => !v)} />
        <div className="md:px-6 py-6 md:mx-auto md:max-w-6xl">
          <PrayerWidget onPauseApp={pauseApp} onResumeApp={resumeApp} />

        </div>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-2 grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-6">
        
        <div className="space-y-6">
          <YouTubePanel
            storedUrl={embedUrl}
            onChangeUrl={(u) => setEmbedUrl(u)}
            onResolved={(p) => setLastParsed(p)}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            <PomodoroCard
              label="Focus 25"
              defaultMinutes={25}
              theme="purple"
              persistKey="ff_timer_25"
              disabled={appPaused}
            />
            <PomodoroCard
              label="Deep 50"
              defaultMinutes={50}
              theme="teal"
              persistKey="ff_timer_50"
              disabled={appPaused}
            />
          </div>

          <TasksPanel disabled={appPaused} />
        </div>
      </main>
    {welcomePopup && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50 animate-fade">
          <div className="bg-white dark:bg-zinc-900 text-center rounded-2xl p-6 px-10 shadow-2xl w-[min(90vw,420px)]">
            <h4 className="text-2xl font-bold mb-6">ازيك 👋</h4>
            <h5 className="text-xl font-bold mb-6">عاوزك تقرا الكام دعاء دول قبل ما تبدأ</h5>
            <p className="opacity-80 mb-4">
اللهم إني أسألك فهم النبيين وحفظ المرسلين والملائكة المقربين، اللهم اجعل ألسنتنا عامرة بذكرك، وقلوبنا بخشيتك، إنك على كل شيء قدير وحسبنا الله ونعم الوكيل            </p>
<p className="opacity-80 mb-4">اللهم أخرجني من ظلمات الوهم وأكرمني بنور الفهم وافتح عليَّ بمعرفة العلم وحسن أخلاقي بالحلم، وحبب إلى قلبي وعقلي ونفسي وكل جوارحي القراءة والدراسة والتعلم والمطالعة، اللهم ألهمني علمًا أعرف به أوامرك وأجتنب به نواهيك</p>
<p className="opacity-80 mb-4">اللهم لا سهل إلا ما جعلته سهلاً، وأنت تجعل الحزن إذا شئت سهلاً، يا أرحم الراحمين</p>
<p className="opacity-80 mb-4">اللهم إني أسألك علما نافعا وأعوذ بك من علم لا ينفع</p>
            <button
              onClick={() => setWelcomePopup(false)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
            >
دلوقتي تقدر تبتدي            </button>
          </div>
        </div>
      )}
    </div>
  );
}

