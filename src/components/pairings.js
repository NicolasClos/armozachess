export function generarEmparejamientosSuizos(roundPlayers, prevPairings) {
  // DEFINO VARIABLES
  let pairings = [];
  let usedPairings = [];
  let usedPlayers = new Set();
  let players = roundPlayers.slice();

  // USED PAIRINGS SON TODOS LOS EMPAREJAMIENTOS QUE YA NO PUEDEN HABER, SI NICOLAS JUGO CON ROCIO, ROCIO YA NO PUEDE JUGAR CON NICOLAS, EN NINGUN ORDEN.

  const reversePrevPairings = prevPairings.map((emparejamiento) => {
    return {
      firstPlayer: emparejamiento.secondPlayer,
      secondPlayer: emparejamiento.firstPlayer,
    };
  });

  usedPairings.push(...prevPairings);
  usedPairings.push(...reversePrevPairings);

  // DESOREDENA LOS JUGADORES Y LOS ORDENA POR PUNTOS (INICIALMENTE ENTONCES EVITA QUE SEA EN ORDEN EN QUE SE AGREGARON LOS JGUADORES)

  const obtenerPermutacionAleatoria = (array) =>
    array.slice().sort(() => Math.random() - 0.5);

  players = obtenerPermutacionAleatoria(players).sort((a, b) => {
    // Introduce un rango de tolerancia para el ordenamiento
    const tolerance = 1.5; // Ajusta según tus necesidades

    const aAdjustedPoints = a.points + (Math.random() - 0.5) * tolerance;
    const bAdjustedPoints = b.points + (Math.random() - 0.5) * tolerance;

    // Ordena de mayor a menor, pero con cierto rango de variación
    return bAdjustedPoints - aAdjustedPoints;
  });

  // Función para verificar si dos jugadores han jugado entre ellos
  const hanJugadoEntreEllos = (firstPlayer, secondPlayer, usedPairings) =>
    usedPairings.some(
      (emparejamiento) =>
        (emparejamiento.firstPlayer.id === firstPlayer.id && emparejamiento.secondPlayer.id === secondPlayer.id) ||
        (emparejamiento.firstPlayer.id === secondPlayer.id && emparejamiento.secondPlayer.id === firstPlayer.id)
    );

  // Función para verificar si un emparejamiento es válido
  const esEmparejamientoValido = (firstPlayer, secondPlayer) => {
    return !(
      usedPlayers.has(firstPlayer.id) ||
      usedPlayers.has(secondPlayer.id) ||
      hanJugadoEntreEllos(firstPlayer, secondPlayer, usedPairings)
    );
  };

  if (players) {
    if (players.length % 2 !== 0) {
      const byePlayer = { id: 'BYE', name: 'BYE', surname: '' };
      players.push(byePlayer);
    }

    let f = 0;

    while (players.length / 2 !== pairings.length && f < 100) {
      if (f > 10) {
        players = obtenerPermutacionAleatoria(roundPlayers);
        console.log('CHANGE PLAYERS');
      }

      pairings = [];
      usedPlayers = new Set();

      let previousPlayer = null;
      for (let i = 0; i < players.length - 1; i++) {
        const firstPlayer = players[i];
        let pairingFound = false;

        for (let j = i + 1; j < players.length; j++) {
          const secondPlayer = players[j];

          if (esEmparejamientoValido(firstPlayer, secondPlayer) && (previousPlayer === null || previousPlayer !== firstPlayer)) {
            pairings.push({
              firstPlayer,
              secondPlayer,
            });

            usedPlayers.add(firstPlayer.id);
            usedPlayers.add(secondPlayer.id);
            previousPlayer = firstPlayer;
            pairingFound = true;
            break;
          }
        }
      }
      f++;
    }

    // Después de generar los emparejamientos
    const countPlayerType = {};

    pairings.forEach((emparejamiento) => {
      const { firstPlayer, secondPlayer } = emparejamiento;

      countPlayerType[firstPlayer.id] = countPlayerType[firstPlayer.id] || { firstPlayer: 0, secondPlayer: 0 };
      countPlayerType[secondPlayer.id] = countPlayerType[secondPlayer.id] || { firstPlayer: 0, secondPlayer: 0 };

      countPlayerType[firstPlayer.id].firstPlayer++;
      countPlayerType[secondPlayer.id].secondPlayer++;
    });

    pairings.forEach((emparejamiento) => {
      const { firstPlayer, secondPlayer } = emparejamiento;

      // Verificar si los roles deben invertirse
      const firstPlayerCount = countPlayerType[firstPlayer.id].firstPlayer;
      const secondPlayerCount = countPlayerType[secondPlayer.id].secondPlayer;

      if (firstPlayerCount > players.length / 2 || secondPlayerCount > players.length / 2) {
        // Invertir los roles
        emparejamiento.firstPlayer = secondPlayer;
        emparejamiento.secondPlayer = firstPlayer;

        // Actualizar el conteo
        countPlayerType[firstPlayer.id].firstPlayer--;
        countPlayerType[secondPlayer.id].secondPlayer--;
      }
    });

    return pairings;
  }
}