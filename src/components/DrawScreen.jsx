import React from "react";

const DrawScreen = ({ onRestart }) => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
        🤝 ¡Es un empate! 🤝
      </h1>
      <p className="text-2xl mt-4 text-gray-300">
        ¡Ambos equipos han demostrado un desempeño increíble!
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

export default DrawScreen;
