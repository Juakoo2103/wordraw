import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import useSound from "use-sound";
import data from "./data/words.json";

import startSfx from "./assets/sounds/start.m4a";

const phases = [
  { key: "ready", label: "¡Preparados!", duration: 3 /* sound: startSfx */ },
  { key: "draw", label: "¡Dibuja ahora!", duration: 60 /* sound: drawSfx */ },
  { key: "guess", label: "¡Adivina!", duration: 20 /* sound: guessSfx */ },
  { key: "end", label: "¡Tiempo terminado!", duration: 0 /* sound: endSfx */ },
];

function App() {
  const [words] = useState(data); // Solo necesitas 'words', no 'setWords'
  const [selectedWord, setSelectedWord] = useState(null);
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // Clave única para reiniciar el temporizador

  const [playStart] = useSound(startSfx);

  const phase = phases[phaseIndex] || null;

  const startRound = () => {
    const rand = Math.floor(Math.random() * words.length);
    setSelectedWord(words[rand]);
    setPhaseIndex(0);
    setIsPlaying(true);
    playStart();
  };

  const nextPhase = () => {
    const next = phaseIndex + 1;
    if (next < phases.length) {
      setPhaseIndex(next); // Cambia a la siguiente fase
      setTimerKey((prevKey) => prevKey + 1); // Reinicia el temporizador
      setIsPlaying(true); // Activa el temporizador
      const sound = phases[next].sound;
      if (sound) {
        switch (phases[next].key) {
          case "draw":
            break;
          case "guess":
            break;
          case "end":
            break;
        }
      }
    } else {
      setIsPlaying(false); // Detén el temporizador al final
    }
  };

  const rerollWord = () => {
    const rand = Math.floor(Math.random() * words.length);
    setSelectedWord(words[rand]);
    setPhaseIndex(0); // Reinicia la fase al inicio
    setIsPlaying(false); // Detén el temporizador antes de reiniciarlo
    setTimerKey((prevKey) => prevKey + 1); // Cambia la clave para reiniciar el temporizador
    setTimeout(() => setIsPlaying(true), 0); // Reactiva el temporizador después de reiniciar
    playStart(); // Reproduce el sonido de inicio
  };

  // Comentada para evitar el error de variable no utilizada
  // const removeWord = (wordToRemove) => {
  //   setWords((prevWords) => prevWords.filter((word) => word !== wordToRemove));
  // };

  console.log("Current phase:", phase);
  console.log("Phase duration:", phase?.duration);
  console.log("Timer key:", timerKey);
  console.log("Is playing:", isPlaying);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">WorDraw!✏️</h1>

      {!isPlaying && (
        <button
          onClick={startRound}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded text-lg font-semibold"
        >
          Empezar Ronda
        </button>
      )}

      {isPlaying && phase && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl animate-pulse">{phase.label}</h2>

          <CountdownCircleTimer
            key={timerKey} // Clave única para reiniciar el temporizador
            isPlaying={isPlaying}
            duration={phase.duration} // Duración de la fase actual
            colors={["#4ade80", "#facc15", "#f87171"]}
            colorsTime={[phase.duration, phase.duration / 2, 0]}
            onComplete={() => {
              nextPhase();
              return { shouldRepeat: false };
            }}
            size={180}
            strokeWidth={10}
          >
            {({ remainingTime }) => (
              <span className="text-4xl font-bold">{remainingTime}</span>
            )}
          </CountdownCircleTimer>

          {phase.key !== "end" && selectedWord && (
            <div className="text-center mt-4">
              <p className="text-gray-400">Palabra:</p>
              <h3 className="text-3xl font-semibold">{selectedWord.word}</h3>
              <p className="text-sm text-gray-400 mt-1">
                Categoría: {selectedWord.category}
              </p>
              <button
                onClick={rerollWord}
                disabled={phase && phase.key === "ready"} // Asegúrate de que phase no sea null
                className={`bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold mt-2 ${
                  phase && phase.key === "ready"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Cambiar palabra
              </button>
            </div>
          )}

          {phase.key === "end" && (
            <button
              onClick={() => {
                setPhaseIndex(-1);
                setSelectedWord(null);
                setIsPlaying(false);
              }}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-lg font-semibold mt-4"
            >
              Volver a jugar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
