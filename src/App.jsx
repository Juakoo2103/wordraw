import { useState } from "react";
import TeamSetup from "./components/TeamSetup";
import GamePhase from "./components/GamePhase";
import WinnerScreen from "./components/WinnerScreen";
import useSound from "use-sound";
import data from "./data/words.json";

import startSfx from "./assets/sounds/start.m4a";

const phases = [
  { key: "ready", label: "¡Preparados!", duration: 3 },
  { key: "draw", label: "¡Dibuja ahora!", duration: 60 },
  { key: "guess", label: "¡Adivina!", duration: 20 },
  { key: "end", label: "¡Tiempo terminado!", duration: 0 },
];

function App() {
  const [words] = useState(data);
  const [selectedWord, setSelectedWord] = useState(null);
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [isWordVisible, setIsWordVisible] = useState(false);

  const [playStart] = useSound(startSfx);

  const [numTeams, setNumTeams] = useState(0); // Número de equipos
  const [participants, setParticipants] = useState([]); // Lista de participantes
  const [teams, setTeams] = useState([]); // Equipos organizados
  const [teamNames, setTeamNames] = useState([]); // Nombres personalizados de los equipos
  const [error, setError] = useState(""); // Mensajes de error
  const [currentRound, setCurrentRound] = useState(1); // Ronda actual
  const [scores, setScores] = useState([]); // Puntuaciones de los equipos
  const [winner, setWinner] = useState(null); // Equipo ganador
  const [currentParticipant, setCurrentParticipant] = useState(null); // Participante actual

  const phase = phases[phaseIndex] || null;

  // Función para comenzar la ronda
  const startRound = () => {
    const rand = Math.floor(Math.random() * words.length);
    setSelectedWord(words[rand]);
    setPhaseIndex(0);
    setIsPlaying(true);
    playStart();

    // Seleccionar el primer participante
    const firstParticipant = getNextParticipant(0);
    setCurrentParticipant(firstParticipant);
  };

  // Función para avanzar a la siguiente fase
  const nextPhase = () => {
    const next = phaseIndex + 1;
    if (next < phases.length) {
      setPhaseIndex(next);
      setTimerKey((prevKey) => prevKey + 1);
      setIsPlaying(true);

      // Reproducir el sonido en la fase "ready"
      if (phases[next].key === "ready") {
        playStart();
      }
    } else {
      setIsPlaying(false);
    }
  };

  // Función para cambiar la palabra seleccionada
  const rerollWord = () => {
    const rand = Math.floor(Math.random() * words.length);
    setSelectedWord(words[rand]);
    setPhaseIndex(0);
    setIsPlaying(false);
    setTimerKey((prevKey) => prevKey + 1);
    setTimeout(() => setIsPlaying(true), 0);
    playStart();
  };

  // Función para alternar la visibilidad de la palabra
  const toggleWordVisibility = () => {
    setIsWordVisible((prev) => !prev);
  };

  // Función para agregar un participante
  const addParticipant = (name) => {
    if (participants.length >= 20) {
      setError("No puedes agregar más de 20 participantes.");
      return;
    }
    setParticipants([...participants, name]);
    setError("");
  };

  // Función para organizar los equipos
  const organizeTeams = () => {
    if (numTeams < 2 || numTeams > 4) {
      setError("El número de equipos debe estar entre 2 y 4.");
      return;
    }
    if (participants.length === 0) {
      setError("Debes agregar al menos un participante.");
      return;
    }

    // Barajar aleatoriamente a los participantes
    const shuffledParticipants = [...participants].sort(
      () => Math.random() - 0.5
    );

    // Crear los equipos distribuyendo equitativamente a los participantes
    const teamsArray = Array.from({ length: numTeams }, (_, i) => ({
      name: `Equipo ${i + 1}`,
      participants: [],
      score: 0, // Inicializar el puntaje del equipo
    }));
    shuffledParticipants.forEach((participant, index) => {
      const teamIndex = index % numTeams; // Distribuir de forma circular
      teamsArray[teamIndex].participants.push(participant);
    });

    setTeams(teamsArray);
    setScores(teamsArray.map(() => 0)); // Inicializar los puntajes
    setTeamNames(teamsArray.map((team) => team.name)); // Inicializar nombres de equipos
    setError("");
  };

  // Función para asignar nombres personalizados a los equipos
  const updateTeamName = (index, name) => {
    if (teamNames.includes(name)) {
      setError("El nombre del equipo debe ser único.");
      return;
    }

    const updatedNames = [...teamNames];
    updatedNames[index] = name;
    setTeamNames(updatedNames);

    const updatedTeams = [...teams];
    updatedTeams[index].name = name;
    setTeams(updatedTeams);
    setError(""); // Limpiar el mensaje de error si todo está bien
  };

  // Función para obtener el siguiente participante
  const getNextParticipant = (round) => {
    const teamIndex = round % numTeams; // Alternar entre equipos
    const participantIndex = Math.floor(round / numTeams); // Participante dentro del equipo
    const team = teams[teamIndex];
    return team.participants[participantIndex] || null;
  };

  // Función para registrar si el equipo adivinó correctamente
  const handleGuess = (didGuessCorrectly) => {
    if (didGuessCorrectly) {
      const updatedScores = [...scores];
      const teamIndex = teams.findIndex((team) =>
        team.participants.includes(currentParticipant)
      );
      updatedScores[teamIndex] += 1; // Incrementar el puntaje del equipo
      setScores(updatedScores);
    }

    // Avanzar al siguiente participante o finalizar el juego
    if (currentRound < participants.length) {
      const nextParticipant = getNextParticipant(currentRound);
      setCurrentParticipant(nextParticipant);
      setCurrentRound(currentRound + 1);
      setPhaseIndex(0); // Reiniciar a la fase "ready"
      setTimerKey((prevKey) => prevKey + 1); // Reiniciar el temporizador
      setIsPlaying(true); // Asegurar que el temporizador esté activo
      playStart(); // Reproducir el sonido en la fase "ready"
    } else {
      setPhaseIndex(-1); // Finalizar el juego
      setIsPlaying(false);

      // Determinar el ganador
      const maxScore = Math.max(...scores);
      const winningTeam = teams.find((_, index) => scores[index] === maxScore);
      setWinner(winningTeam);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-gray-900 text-white p-4">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 animate-pulse">
        WorDraw! ✏️
      </h1>

      {!isPlaying && winner && (
        <WinnerScreen
          winner={winner}
          onRestart={() => window.location.reload()}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 px-6 py-2 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300"
        />
      )}

      {!isPlaying && !winner && (
        <TeamSetup
          numTeams={numTeams}
          setNumTeams={setNumTeams}
          participants={participants}
          addParticipant={addParticipant}
          organizeTeams={organizeTeams}
          teams={teams}
          teamNames={teamNames}
          updateTeamName={updateTeamName}
          startRound={startRound}
          error={error}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 px-6 py-2 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300"
        />
      )}

      {isPlaying && phase && (
        <GamePhase
          phase={phase}
          currentParticipant={currentParticipant}
          teams={teams}
          timerKey={timerKey}
          nextPhase={nextPhase}
          selectedWord={selectedWord}
          isWordVisible={isWordVisible}
          toggleWordVisibility={toggleWordVisibility}
          rerollWord={rerollWord}
          handleGuess={handleGuess}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 px-6 py-2 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300"
        />
      )}
    </div>
  );
}

export default App;
