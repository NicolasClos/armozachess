export const getTournaments = () => {
  const tournaments = localStorage.getItem("tournaments")
  if (tournaments !== null) {
    return (JSON.parse(tournaments))
  }
  return []
}

export const createTournament = (tournamentName) => {
  const tournaments = localStorage.getItem("tournaments");

  if (tournaments === null) {
    localStorage.setItem("tournaments", "[]");
  }
  let arrayTournaments = getTournaments()

  const existeTorneo = arrayTournaments.some((tournament) => tournament.name === tournamentName);

  if (existeTorneo) {
  } else {
    const newTournament = [{ name: tournamentName, players: [], started: false, finished: false, rounds: 6, byeValue: 0.5, winner: '', results: [] }, ...arrayTournaments];
    localStorage.setItem("tournaments", JSON.stringify(newTournament));
  }
};

export const getSelectedTournament = () => {
    const selectedTournament = localStorage.getItem("selectedTournament");
    return JSON.parse(selectedTournament)
};

export const updateSelectedTournament = (selectedTournament) => {
    localStorage.setItem("selectedTournament", JSON.stringify(selectedTournament));
};

export const updateTournamentStarted = (tournamentName, started) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(tournament => {
    if (tournament.name === tournamentName.name) {
      return { ...tournament, started };
    }
    return tournament;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateTournamentFinished = (tournamentName, finished) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(tournament => {
    if (tournament.name === tournamentName.name) {
      return { ...tournament, finished };
    }
    return tournament;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateTournamentRounds = (tournamentName, rounds) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(tournament => {
    if (tournament.name === tournamentName.name) {
      return { ...tournament, rounds };
    }
    return tournament;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateTournamentByeValue = (tournamentName, byeValue) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(tournament => {
    if (tournament.name === tournamentName.name) {
      return { ...tournament, byeValue };
    }
    return tournament;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateTournamentWinner = (tournamentName, winner) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(tournament => {
    if (tournament.name === tournamentName.name) {
      return { ...tournament, winner };
    }
    return tournament;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateTournamentResults = (tournamentName, results) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(tournament => {
    if (tournament.name === tournamentName.name) {
      return { ...tournament, results };
    }
    return tournament;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const deleteTournament = (tournament) => {
  const tournaments = getTournaments();

  const newArray = tournaments.filter((t) => t.name !== tournament.name);

  localStorage.setItem("tournaments", JSON.stringify(newArray));
}
const generateAutoIncrementalId = (players) => {
  const maxId = players.reduce((max, player) => (player.id > max ? player.id : max), 0);
  return maxId + 1;
};

export const addPlayer = (tournament, player) => {
  const tournaments = getTournaments();

  const existingPlayer = tournament.players.find(
    (existingPlayer) =>
      existingPlayer &&
      existingPlayer.name &&
      existingPlayer.surname &&
      existingPlayer.name.toLowerCase() === player.name.toLowerCase() &&
      existingPlayer.surname.toLowerCase() === player.surname.toLowerCase()
  );

  if (existingPlayer) {
    return 0;
  }

  if (player.name === '') {
    return 0;
  }

  if (player.surname === '') {
    return 0;
  }

  let indiceObjetoAModificar = tournaments.findIndex((t) => t.name === tournament.name);

  // Si el objeto con 'name' igual a 'Torneo' existe en el array
  if (indiceObjetoAModificar !== -1) {
    // Obtén todos los jugadores de todos los torneos
    const allPlayers = tournaments.reduce((players, tournament) => players.concat(tournament.players), []);

    // Genera un nuevo ID único
    const newPlayerId = generateAutoIncrementalId(allPlayers);

    // Crea un nuevo array con la modificación
    let newArray = tournaments.map((objeto, indice) => {
      if (indice === indiceObjetoAModificar) {
        // Modifica el objeto deseado
        const newPlayer = { ...player, id: newPlayerId, points: 0 };
        return { ...objeto, players: objeto.players.concat(newPlayer) };
      }
      return objeto; // Retorna el objeto sin modificar en los otros casos
    });

    // Guarda el nuevo array en el almacenamiento local
    localStorage.setItem("tournaments", JSON.stringify(newArray));
  }
};

export const addExistingPlayer = (tournament, player) => {
  const tournaments = getTournaments();

  let indiceObjetoAModificar = tournaments.findIndex((t) => t.name === tournament.name);

  // Si el objeto con 'name' igual a 'Torneo' existe en el array
  if (indiceObjetoAModificar !== -1) {
    // Obtén todos los jugadores de todos los torneos
    const allPlayers = tournaments.reduce((players, tournament) => players.concat(tournament.players), []);

    // Genera un nuevo ID únic

    // Crea un nuevo array con la modificación
    let newArray = tournaments.map((objeto, indice) => {
      if (indice === indiceObjetoAModificar) {
        // Modifica el objeto deseado
        const newPlayer = { ...player };
        return { ...objeto, players: objeto.players.concat(newPlayer) };
      }
      return objeto; // Retorna el objeto sin modificar en los otros casos
    });

    // Guarda el nuevo array en el almacenamiento local
    localStorage.setItem("tournaments", JSON.stringify(newArray));
  }
};


export const deletePlayer = (tournamentName, playerID) => {
  const tournaments = getTournaments();

  // Encuentra el torneo correspondiente
  const tournament = tournaments.find((t) => t.name === tournamentName)

  // Si se encuentra el torneo y tiene jugadores
  if (tournament && tournament.players) {
    // Filtra los jugadores para mantener solo aquellos cuyo nombre y apellido no coinciden con el jugadorID proporcionado
    tournament.players = tournament.players.filter(
      (p) => !(p.id === playerID)
    );
  }

  // Actualiza el array de torneos en el almacenamiento local
  localStorage.setItem("tournaments", JSON.stringify(tournaments));
};

// Función para obtener todos los jugadores de todos los torneos
export const getAllPlayers = (selectedPlayers) => {
  const tournaments = getTournaments();
  const uniquePlayersSet = new Set();

  tournaments.forEach(tournament => {
    tournament.players.forEach(player => {
      uniquePlayersSet.add(player.id);
    });
  });

  const playerIds = [...uniquePlayersSet];

  if (playerIds.length > 0 && selectedPlayers) {
    const resultPlayerIds = playerIds.filter(playerId =>
      !selectedPlayers.some(selectedPlayer =>
        playerId === selectedPlayer.id
      )
    );

    const uniqueResultPlayers = tournaments.reduce((players, tournament) => {
      const filteredPlayers = tournament.players.filter(player => resultPlayerIds.includes(player.id));
      return players.concat(filteredPlayers);
    }, []);

    // Eliminar duplicados por ID
    const finalPlayers = uniqueResultPlayers.filter((player, index, self) =>
      index === self.findIndex(p => p.id === player.id)
    );

    return finalPlayers;
  }

  return [];
};

export const getPlayersByTournament = (tournamentName) => {
  const tournaments = getTournaments()
  const tournament = tournaments.find((t) => t.name === tournamentName.name)
  return (tournament ? tournament.players : [])
}