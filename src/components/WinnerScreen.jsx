import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const WinnerScreen = ({ winner, onRestart }) => {
  const { width, height } = useWindowSize(); // Obtener el tamaño de la ventana para el confetti

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white">
      <Confetti width={width} height={height} numberOfPieces={500} />
      <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 animate-pulse">
        🎉 ¡El ganador es {winner.name}! 🎉
      </h1>
      <p className="text-2xl mt-4 text-gray-300">
        ¡Felicidades al equipo {winner.name} por su increíble desempeño!
      </p>
      <button
        onClick={onRestart}
        className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform transform hover:scale-110 duration-300"
      >
        Volver a jugar
      </button>
    </div>
  );
};

export default WinnerScreen;
