import React from "react";

const TeamSetup = ({
  numTeams,
  setNumTeams,
  participants,
  addParticipant,
  organizeTeams,
  teams,
  teamNames,
  updateTeamName,
  startRound,
  error,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {teams.length === 0 ? (
        <>
          <p className="text-lg">Selecciona el número de equipos:</p>
          <select
            value={numTeams}
            onChange={(e) => setNumTeams(Number(e.target.value))}
            className="px-4 py-2 rounded bg-gray-800 text-white"
          >
            <option value={0}>Selecciona...</option>
            <option value={2}>2 Equipos</option>
            <option value={3}>3 Equipos</option>
            <option value={4}>4 Equipos</option>
          </select>
          <p className="text-lg">Agrega participantes:</p>
          <input
            type="text"
            placeholder="Nombre del participante"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addParticipant(e.target.value);
                e.target.value = "";
              }
            }}
            className="px-4 py-2 rounded bg-gray-800 text-white"
          />
          <button
            onClick={organizeTeams}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-300"
          >
            Organizar Equipos
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <div className="mt-4">
            <h2 className="text-xl font-bold">Participantes:</h2>
            <ul className="list-disc pl-6">
              {participants.map((participant, index) => (
                <li key={index}>{participant}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold">Asigna nombres a los equipos:</h2>
          {teams.map((team, index) => (
            <div key={index} className="flex items-center gap-4">
              <p className="text-lg">{`Equipo ${index + 1}:`}</p>
              <input
                type="text"
                value={teamNames[index]}
                onChange={(e) => updateTeamName(index, e.target.value)}
                className="px-4 py-2 rounded bg-gray-800 text-white"
              />
            </div>
          ))}
          <button
            onClick={startRound}
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-lg font-semibold shadow-md transition-all duration-300"
          >
            Empezar Ronda
          </button>
        </>
      )}
    </div>
  );
};

export default TeamSetup;
