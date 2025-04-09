import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const GamePhase = ({
  phase,
  currentParticipant,
  teams,
  timerKey,
  nextPhase,
  selectedWord,
  isWordVisible,
  toggleWordVisibility,
  rerollWord,
  handleGuess,
}) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-3xl font-bold animate-bounce">{phase.label}</h2>

      {phase.key === "ready" && currentParticipant && (
        <p className="text-xl font-semibold">
          Turno del equipo{" "}
          {
            teams.find((team) => team.participants.includes(currentParticipant))
              ?.name
          }
          , ¡prepárense!
        </p>
      )}

      {phase.key === "draw" && currentParticipant && (
        <p className="text-xl font-semibold">Turno de: {currentParticipant}</p>
      )}

      <CountdownCircleTimer
        key={timerKey}
        isPlaying={true}
        duration={phase.duration}
        colors={["#4ade80", "#facc15", "#f87171"]}
        colorsTime={[phase.duration, phase.duration / 2, 0]}
        onComplete={() => {
          nextPhase();
          return { shouldRepeat: false };
        }}
        size={200}
        strokeWidth={12}
      >
        {({ remainingTime }) => (
          <span className="text-5xl font-bold">{remainingTime}</span>
        )}
      </CountdownCircleTimer>

      {phase.key === "guess" && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleGuess(true)}
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-300"
          >
            Adivinó
          </button>
          <button
            onClick={() => handleGuess(false)}
            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-300"
          >
            No Adivinó
          </button>
        </div>
      )}

      {phase.key !== "end" && selectedWord && (
        <div className="text-center mt-4">
          <p className="text-lg text-gray-300">Palabra:</p>
          {isWordVisible ? (
            <h3 className="text-4xl font-semibold">{selectedWord.word}</h3>
          ) : (
            <h3 className="text-4xl font-semibold text-gray-500">Oculto</h3>
          )}
          <p className="text-base text-gray-400 mt-2">
            Categoría: {selectedWord.category}
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={toggleWordVisibility}
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-300"
            >
              {isWordVisible ? "Ocultar palabra" : "Mostrar palabra"}
            </button>
            <button
              onClick={rerollWord}
              disabled={phase && phase.key === "ready"}
              className={`bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-300 ${
                phase && phase.key === "ready"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Cambiar palabra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePhase;
