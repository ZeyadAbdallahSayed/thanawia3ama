// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import adhanAudio from "./audios/extracted_audio.mp3";


// const PrayerWidget = ({ onPauseApp, onResumeApp }) => {
//   const [prayerTimes, setPrayerTimes] = useState(null);
//   const [nextPrayer, setNextPrayer] = useState(null);
//   const [timeLeft, setTimeLeft] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     axios
//       .get("https://api.aladhan.com/v1/timingsByCity", {
//         params: { city: "Cairo", country: "Egypt", method: 5 },
//       })
//       .then((res) => setPrayerTimes(res.data.data.timings))
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     if (!prayerTimes) return;
//     const timer = setInterval(() => {
//       const now = new Date();
//       let upcoming = null;

//       for (const [name, timeStr] of Object.entries(prayerTimes)) {
//         if (["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(name)) {
//           const [h, m] = timeStr.split(":").map(Number);
//           const dt = new Date(now);
//           dt.setHours(h, m, 0, 0);
//           if (dt > now) {
//             upcoming = { name, time: dt };
//             break;
//           }
//         }
//       }

//       if (!upcoming) {
//         const [h, m] = prayerTimes.Fajr.split(":").map(Number);
//         const dt = new Date(now);
//         dt.setDate(dt.getDate() + 1);
//         dt.setHours(h, m, 0, 0);
//         upcoming = { name: "Fajr", time: dt };
//       }
//       setNextPrayer(upcoming);

//       const diff = upcoming.time - now;
//       const hh = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
//       const mm = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0");
//       const ss = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
//       setTimeLeft(`${hh}:${mm}:${ss}`);

//       if (diff <= 1000 && !showPopup) {
//         audioRef.current.play();
//         setShowPopup(true);
//         onPauseApp?.();
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [prayerTimes, showPopup, onPauseApp]);

//   const handleDone = () => {
//     audioRef.current.pause();
//     audioRef.current.currentTime = 0;
//     setShowPopup(false);
//     onResumeApp?.();
//     // alert("تقبل الله صلاتك 🤲");
//   };

//   if (!prayerTimes) return <div>جاري تحميل المواقيت...</div>;

//   return (
//     <div className="rounded-2xl shadow-xl p-4 bg-white/70 dark:bg-white/5 border border-black/5">
//       <h3 className="font-semibold mb-3">Prayer Times – Cairo</h3>
//       <div className="grid grid-cols-3 gap-3 mb-4">
//         {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((name) => (
//           <div
//             key={name}
//             className="rounded-xl p-3 bg-white/80 dark:bg-white/10 text-center"
//           >
//             <h4 className="font-bold">{name}</h4>
//             <p>{prayerTimes[name]}</p>
//           </div>
//         ))}
//       </div>

//       {nextPrayer && (
//         <div className="text-center p-3 rounded-xl bg-indigo-600 text-white font-medium">
//           Next: {nextPrayer.name} – {timeLeft}
//         </div>
//       )}

//       {showPopup && (
//         <div className="fixed inset-0 bg-black/50 grid place-items-center z-50">
//           <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl w-[min(90vw,420px)] text-center">
//             <h3 className="text-2xl font-bold mb-2">{nextPrayer.name}</h3>
//             <h4 className="text-xl font-bold mb-2">
//              ... قوم صلي وتعالي كمل 
//             </h4>
//             <h5 className="text-l font-bold mb-2">وافتكر ان </h5>
//             <p className="text-3xl font-bold mb-2">لا بارك الله في عمل يلهي عن الصلاه</p>
//             <button
//               onClick={handleDone}
//               className="px-4 py-2 mt-4 rounded-xl bg-green-600 text-white"
//             >
// يلا قوم متكسلش 
//             </button>
//           </div>
//         </div>
//       )}

// <audio ref={audioRef} src={adhanAudio} preload="auto" />
//     </div>
//   );
// };

// export default PrayerWidget;



import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import adhanAudio from "./audios/extracted_audio.mp3";
import sunriseAudio from "./audios/mixkit-forest-birds-ambience-1210.wav"; // صوت مختلف للشروق

const PrayerWidget = ({ onPauseApp, onResumeApp }) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSunrise, setIsSunrise] = useState(false);
    const [currentPrayer, setCurrentPrayer] = useState(null);


  const audioRef = useRef(null);
  const sunriseRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://api.aladhan.com/v1/timingsByCity", {
        params: { city: "Cairo", country: "Egypt", method: 5 },
      })
      .then((res) => setPrayerTimes(res.data.data.timings))
      .catch(() => setPrayerTimes("error"));
  }, []);

  useEffect(() => {
    if (!prayerTimes || prayerTimes === "error") return;
    const timer = setInterval(() => {
      const now = new Date();
      let upcoming = null;

      for (const [name, timeStr] of Object.entries(prayerTimes)) {
        if (["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(name)) {
          const [h, m] = timeStr.split(":").map(Number);
          const dt = new Date(now);
          dt.setHours(h, m, 0, 0);
          if (dt > now) {
            upcoming = { name, time: dt };
            break;
          }
        }
      }

      if (!upcoming) {
        const [h, m] = prayerTimes.Fajr.split(":").map(Number);
        const dt = new Date(now);
        dt.setDate(dt.getDate() + 1);
        dt.setHours(h, m, 0, 0);
        upcoming = { name: "Fajr", time: dt };
      }
      setNextPrayer(upcoming);

      const diff = upcoming.time - now;
      const hh = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
      const mm = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0");
      const ss = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
      setTimeLeft(`${hh}:${mm}:${ss}`);



if (diff <= 1000 && !showPopup) {
  // هنا الصلاة اللي بدأ وقتها هو upcoming نفسه
  setCurrentPrayer({ name: upcoming.name });

  if (upcoming.name === "Sunrise") {
    sunriseRef.current.play();
    setIsSunrise(true);
  } else {
    audioRef.current.play();
    setIsSunrise(false);
  }
  setShowPopup(true);
  onPauseApp?.();
}

    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes, onPauseApp, showPopup]);

  const handleDone = () => {
    if (isSunrise) {
      sunriseRef.current.pause();
      sunriseRef.current.currentTime = 0;
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowPopup(false);
    onResumeApp?.();
  };

  if (!prayerTimes) return <div>جاري تحميل المواقيت...</div>;
  if (prayerTimes === "error") return <div>تعذر تحميل المواقيت ⏳</div>;

  return (
    <div className="rounded-2xl shadow-xl p-4 bg-white/70 dark:bg-white/5 border border-black/5">
      <h3 className="font-semibold mb-3">Prayer Times – Cairo</h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((name) => (
          <div
            key={name}
            className="rounded-xl p-3 bg-white/80 dark:bg-white/10 text-center"
          >
            <h4 className="font-bold">{name}</h4>
            <p>{prayerTimes[name]}</p>
          </div>
        ))}
      </div>

      {nextPrayer && (
        <div className="text-center p-3 rounded-xl bg-indigo-600 text-white font-medium">
          Next: {nextPrayer.name} – {timeLeft}
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl w-[min(90vw,420px)] text-center">
            {isSunrise ? (
              <>
                <h3 className="text-2xl font-bold mb-2">🌅 وقت الشروق</h3>
                <p className="text-lg mb-4">قوم صلي ركعتين الضحي وتعالي </p>
                <p className="text-lg mb-4">واقرأ صفحتين م القرأن واذكار الصباح  </p>
                <button
                  onClick={handleDone}
                  className="px-4 py-2 mt-2 rounded-xl bg-yellow-500 text-white"
                >
 يلا قوم وتعالي تاني </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-2">{currentPrayer.name}</h3>
                <h4 className="text-xl font-bold mb-2">
                  ... قوم صلي وتعالي كمل
                </h4>
                <h5 className="text-l font-bold mb-2">وافتكر ان </h5>
                <p className="text-3xl font-bold mb-2">
                  لا بارك الله في عمل يلهي عن الصلاه
                </p>
                <button
                  onClick={handleDone}
                  className="px-4 py-2 mt-4 rounded-xl bg-green-600 text-white"
                >
                  يلا قوم متكسلش
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <audio ref={audioRef} src={adhanAudio} preload="auto" />
      <audio ref={sunriseRef} src={sunriseAudio} preload="auto" />
    </div>
  );
};

export default PrayerWidget;



