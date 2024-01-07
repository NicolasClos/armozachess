import { CreateTournamentToast, EmptyTournamentErrorToast, DeleteTournamentToast, CreateTournamentErrorToast, AddPlayerToast, DeletePlayerToast, AddPlayerErrorToast, AddPlayerError2Toast } from '@/components/toasts'

export const getTournaments = () => {
  const tournaments = localStorage.getItem("tournaments")
  if (tournaments !== null) {
    return (JSON.parse(tournaments))
  }
  return []
}

export const createTournament = (tournamentName) => {
  const generateAutoIncrementalId = (tournaments) => {
    const lastTournament = tournaments[tournaments.length - 1];
    const lastId = lastTournament ? lastTournament.id : 0;
    return lastId + 1;
  };

  const newDate = () => {
    let fechaActual = new Date();

    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const año = fechaActual.getFullYear();

    const fechaFormateada = (dia < 10 ? '0' : '') + dia + '/' + (mes < 10 ? '0' : '') + mes + '/' + año;

    return fechaFormateada;
  }

  let tournaments = localStorage.getItem("tournaments");

  if (tournaments === null) {
    localStorage.setItem("tournaments", "[]");
    tournaments = "[]";
  }

  let arrayTournaments = JSON.parse(tournaments);

  const validTournament = /^[^\s]+.*[^\s]*$/;

  const tournamentId = generateAutoIncrementalId(arrayTournaments);

  if (!validTournament.test(tournamentName)) {
    return EmptyTournamentErrorToast();
  } else {
    const newTournament = {
      id: tournamentId,
      name: tournamentName,
      players: [],
      started: false,
      finished: false,
      rounds: [],
      byeValue: 1,
      winner: '',
      results: [],
      date: newDate()
    };

    arrayTournaments = [...arrayTournaments, newTournament];

    localStorage.setItem("tournaments", JSON.stringify(arrayTournaments));
  }
};

export const updateTournaments = (tournament) => {
  let arrayTournaments = getTournaments();

  const updatedTournaments = arrayTournaments.map((t) => t.id == tournament.id ? {
    ...tournament
  } : t);

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateAllTournaments = (tournaments) => {
  localStorage.setItem("tournaments", JSON.stringify(tournaments));
};

export const getSelectedTournament = () => {
  const selectedTournament = localStorage.getItem("selectedTournament");
  return JSON.parse(selectedTournament)
};

export const updateSelectedTournament = (selectedTournament) => {
  localStorage.setItem("selectedTournament", JSON.stringify(selectedTournament));
};

export const updateTournamentStarted = (tournament, started) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(t => {
    if (t.id === tournament.id) {
      return {
        ...t,
        started
      };
    }
    return t;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export function updatePlayersAllTournaments(updatedPlayers) {
  
  let arrayTournaments = getTournaments();

  arrayTournaments.forEach((torneo) => {

    updatedPlayers.forEach((updatedPlayer) => {

      const jugador = torneo.players.find((jugador) => jugador.id === updatedPlayer.id);

      if (jugador) {
        Object.assign(jugador, updatedPlayer);
      }
    });
  });

  updateTournaments(arrayTournaments);
  updateAllTournaments(arrayTournaments)
}

export const updateTournamentFinished = (tournament, finished) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(t => {
    if (t.id === tournament.id) {
      return {
        ...t,
        finished
      };
    }
    return t;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateTournamentRounds = (tournament, rounds) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(t => {
    if (t.id === tournament.id) {
      return {
        ...t,
        rounds
      };
    }
    return t;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateTournamentByeValue = (tournament, byeValue) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(t => {
    if (t.id === tournament.id) {
      return {
        ...t,
        byeValue
      };
    }
    return t;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateTournamentWinner = (tournament, winner) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(t => {
    if (t.id === tournament.id) {
      return {
        ...t,
        winner
      };
    }
    return t;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateTournamentResults = (tournament, results) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(t => {
    if (t.id === tournament.id) {
      return {
        ...t,
        results
      };
    }
    return t;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const updateTournamentPlayers = (tournament, players) => {
  const tournaments = getTournaments();

  const updatedTournaments = tournaments.map(t => {
    if (t.id === tournament.id) {
      return {
        ...t,
        players: players
      };
    }
    return t;
  });

  localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
};

export const deleteTournament = (tournament) => {
  const tournaments = getTournaments();

  const newArray = tournaments.filter((t) => t.id !== tournament.id);

  DeleteTournamentToast()

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
    AddPlayerError2Toast()
    return 0;
  }

  if (player.name === '') {
    AddPlayerErrorToast()
    return 0;
  }

  if (player.surname === '') {
    AddPlayerErrorToast()
    return 0;
  }

  let indiceObjetoAModificar = tournaments.findIndex((t) => t.id === tournament.id);

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
        const newPlayer = {
          ...player,
          id: newPlayerId,
          tournaments: [{ id: 0, rounds: [{ oponentId: 0, result: 0, color: 0 }], points: 0 }],
          points: 0,
          elo: 1500,
          games: 0,
          wins: 0,
          loses: 0,
          draws: 0
        };
        return {
          ...objeto,
          players: objeto.players.concat(newPlayer)
        };
      }
      return objeto
    });

    AddPlayerToast()
    // Guarda el nuevo array en el almacenamiento local
    localStorage.setItem("tournaments", JSON.stringify(newArray));
  }
};

export const updatePlayerNameAndSurnameInAllTournaments = (player, newName, newSurname) => {

  let tournaments = getTournaments();

  tournaments = tournaments.map((tournament) => {
    const updatedPlayers = tournament.players.map((p) => {
      if (p.id === player.id) {
        return {
          ...player,
          name: newName !== undefined ? newName : p.name,
          surname: newSurname !== undefined ? newSurname : p.surname,
        };
      }
      return player;
    });

    return { ...tournament, players: updatedPlayers };
  });

  updateTournaments(tournaments);
};


export const updatePlayerInfo = (tournaments)=>{
    for (let i = 0; i < tournaments.length; i++) {
      const torneo = tournaments[i];

      // Actualizar las estadísticas para cada jugador en el torneo
      for (let j = 0; j < torneo.players.length; j++) {
          const jugador = torneo.players[j];

          // Encontrar el torneo específico del jugador
          const torneoJugador = jugador.tournaments.find(t => t.id === torneo.id);

          // Si se encuentra el torneo, actualizar las estadísticas
          if (torneoJugador) {
              jugador.elo = calcularNuevoElo(jugador.elo, torneoJugador.points);
              jugador.games += torneoJugador.rounds.length;
              jugador.wins += contarResultados(torneoJugador.rounds, 1); // 1 representa una victoria
              jugador.draws += contarResultados(torneoJugador.rounds, 0); // 0 representa un empate
              jugador.loses += contarResultados(torneoJugador.rounds, -1); // -1 representa una derrota
          }
      }
  }
}

export const addExistingPlayer = (tournament, player) => {
  const tournaments = getTournaments();

  let indiceObjetoAModificar = tournaments.findIndex((t) => t.id === tournament.id);

  // Si el objeto con 'name' igual a 'Torneo' existe en el array
  if (indiceObjetoAModificar !== -1) {
    // Obtén todos los jugadores de todos los torneos
    const allPlayers = tournaments.reduce((players, tournament) => players.concat(tournament.players), []);

    // Genera un nuevo ID únic

    // Crea un nuevo array con la modificación
    let newArray = tournaments.map((objeto, indice) => {
      if (indice === indiceObjetoAModificar) {
        // Modifica el objeto deseado
        const newPlayer = {
          ...player
        };
        return {
          ...objeto,
          players: objeto.players.concat(newPlayer)
        };
      }
      return objeto; // Retorna el objeto sin modificar en los otros casos
    });

    // Guarda el nuevo array en el almacenamiento local
    localStorage.setItem("tournaments", JSON.stringify(newArray));
  }
};


export const deletePlayer = (tournament, playerID) => {
  const tournaments = getTournaments();

  // Encuentra el torneo correspondiente
  const selectedTournament = tournaments.find((t) => t.id === tournament.id)

  // Si se encuentra el torneo y tiene jugadores
  if (selectedTournament && selectedTournament.players) {
    // Filtra los jugadores para mantener solo aquellos cuyo nombre y apellido no coinciden con el jugadorID proporcionado
    selectedTournament.players = selectedTournament.players.filter(
      (p) => !(p.id === playerID)
    );

    DeletePlayerToast();

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

export const getPlayersByTournament = (tournament) => {
  const tournaments = getTournaments()
  if (tournaments) {
    const selectedTournament = tournaments.find((t) => t.id === tournament.id)
    return (selectedTournament ? selectedTournament.players : [])
  }
}

export const updateEloInTournaments = (updates) => {
  const tournaments = getTournaments();

  updates.forEach(([playerId, eloVariation]) => {
    tournaments.forEach((tournament) => {
      const playerIndex = tournament.players.findIndex((player) => player.id === playerId);

      if (playerIndex !== -1) {
        tournament.players[playerIndex].elo += eloVariation;
      }
    });
  });

  localStorage.setItem("tournaments", JSON.stringify(tournaments));
};