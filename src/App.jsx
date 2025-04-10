import { useState } from "react";
import TeamSetup from "./components/TeamSetup";
import GamePhase from "./components/GamePhase";
import WinnerScreen from "./components/WinnerScreen";
import DrawScreen from "./components/DrawScreen";
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
  const [scores, setScores] = useState([]); // Inicializar como un array vacío
  const [winner, setWinner] = useState(null); // Equipo ganador
  const [currentParticipant, setCurrentParticipant] = useState(null); // Participante actual
  const [isDraw, setIsDraw] = useState(false); // Empate

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

      // Si la fase actual es "guess" y el tiempo termina, registrar que no adivinó
      if (phases[phaseIndex]?.key === "guess") {
        handleGuess(false); // Registrar que el equipo no adivinó
      }

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
    if (participants.length < 2) {
      setError("Debes agregar al menos 2 participantes.");
      return;
    }

    const shuffledParticipants = [...participants].sort(
      () => Math.random() - 0.5
    );

    const teamsArray = Array.from({ length: numTeams }, (_, i) => ({
      name: `Equipo ${i + 1}`,
      participants: [],
    }));
    shuffledParticipants.forEach((participant, index) => {
      const teamIndex = index % numTeams;
      teamsArray[teamIndex].participants.push(participant);
    });

    setTeams(teamsArray);
    setScores(teamsArray.map(() => [])); // Inicializar los puntajes como arrays vacíos
    setTeamNames(teamsArray.map((team) => team.name));
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
    const teamIndex = round % numTeams; // Alternar entre equipos de forma circular
    const participantIndex = Math.floor(round / numTeams); // Avanzar al siguiente participante dentro del equipo
    const team = teams[teamIndex];

    // Verificar si el participante existe en el equipo
    return team.participants[participantIndex] || null;
  };

  // Función para registrar si el equipo adivinó correctamente
  const handleGuess = (didGuessCorrectly) => {
    if (didGuessCorrectly) {
      const updatedScores = [...scores];
      const teamIndex = teams.findIndex((team) =>
        team.participants.includes(currentParticipant)
      );
      updatedScores[teamIndex].push(selectedWord); // Agregar la palabra adivinada al array del equipo
      setScores(updatedScores);
    }

    if (currentRound < participants.length) {
      const nextParticipant = getNextParticipant(currentRound);
      setCurrentParticipant(nextParticipant);
      setCurrentRound(currentRound + 1);

      const rand = Math.floor(Math.random() * words.length);
      setSelectedWord(words[rand]);

      setPhaseIndex(0);
      setTimerKey((prevKey) => prevKey + 1);
      setIsPlaying(true);
      playStart();
    } else {
      // Calcular resultado final
      const maxScore = Math.max(
        ...scores.map((teamScores) => teamScores.length)
      );
      const teamsWithMaxScore = teams.filter(
        (_, index) => scores[index].length === maxScore
      );

      if (
        scores.every((teamScores) => teamScores.length === scores[0].length)
      ) {
        // Caso 1: Todos los equipos tienen el mismo puntaje
        setIsDraw(true);
        setWinner(null);
      } else if (teamsWithMaxScore.length > 1) {
        // Caso 2: Más de un equipo tiene el puntaje máximo
        setIsDraw(true);
        setWinner(null);
      } else if (teamsWithMaxScore.length === 1) {
        // Caso 3: Solo un equipo tiene el puntaje máximo
        setWinner(teamsWithMaxScore[0]);
        setIsDraw(false);
      }

      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-8 text-center animate-pulse">
        WorDraw! ✏️
      </h1>

      {/* Mostrar pantalla de empate si terminó el juego y hubo empate */}
      {!isPlaying && isDraw && (
        <DrawScreen onRestart={() => window.location.reload()} />
      )}

      {/* Mostrar pantalla de ganador si terminó el juego y hay un equipo ganador */}
      {!isPlaying && winner && !isDraw && (
        <WinnerScreen
          winner={winner}
          onRestart={() => window.location.reload()}
        />
      )}

      {/* Mostrar pantalla de configuración si no hay juego activo y no terminó */}
      {!isPlaying && !winner && !isDraw && (
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
        />
      )}

      {/* Mostrar pantalla de juego si el juego está activo y hay una fase actual */}
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
        />
      )}

      {/* Mostrar puntajes de los equipos */}
      {teams.map((team, index) => (
        <div key={index}>
          <h3>{team.name}</h3>
          <p>Puntaje: {scores[index].length}</p>
        </div>
      ))}
    </div>
  );
}
export default App;
