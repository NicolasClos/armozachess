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
    const tolerance = 3; // Ajusta según tus necesidades

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
    const countPlayedAs = { firstPlayer: {}, secondPlayer: {} };

    pairings.forEach((emparejamiento) => {
      const { firstPlayer, secondPlayer } = emparejamiento;

      countPlayerType[firstPlayer.id] = countPlayerType[firstPlayer.id] || { firstPlayer: 0, secondPlayer: 0 };
      countPlayerType[secondPlayer.id] = countPlayerType[secondPlayer.id] || { firstPlayer: 0, secondPlayer: 0 };

      countPlayerType[firstPlayer.id].firstPlayer++;
      countPlayerType[secondPlayer.id].secondPlayer++;

      // Contar cuántas veces jugó cada jugador como blancas y negras en prevPairings
      countPlayedAs.firstPlayer = countPlayedAs.firstPlayer || {};
      countPlayedAs.secondPlayer = countPlayedAs.secondPlayer || {};

      countPlayedAs.firstPlayer[firstPlayer.id] = countPlayedAs.firstPlayer[firstPlayer.id] || 0;
      countPlayedAs.secondPlayer[secondPlayer.id] = countPlayedAs.secondPlayer[secondPlayer.id] || 0;

      countPlayedAs.firstPlayer[firstPlayer.id]++;
      countPlayedAs.secondPlayer[secondPlayer.id]++;
    });

    // Modificar el orden de los emparejamientos para que sea parejo quien jugó de negras y de blancas
    pairings.forEach((emparejamiento) => {
      const { firstPlayer, secondPlayer } = emparejamiento;

      // Verificar cuántas veces ha jugado cada jugador como blancas y negras
      const firstPlayerPlayedAsWhite = countPlayedAs.firstPlayer[firstPlayer.id] || 0;
      const secondPlayerPlayedAsWhite = countPlayedAs.firstPlayer[secondPlayer.id] || 0;

      // Verificar cuántas veces ha jugado cada jugador como negras y blancas
      const firstPlayerPlayedAsBlack = countPlayedAs.secondPlayer[firstPlayer.id] || 0;
      const secondPlayerPlayedAsBlack = countPlayedAs.secondPlayer[secondPlayer.id] || 0;

      // Determinar cuál de los dos jugadores debe jugar como blancas y cuál como negras
      if (
        (firstPlayerPlayedAsWhite + secondPlayerPlayedAsBlack > firstPlayerPlayedAsBlack + secondPlayerPlayedAsWhite) ||
        (secondPlayer.id !== 'BYE')
      ) {
        emparejamiento.firstPlayer = secondPlayer;
        emparejamiento.secondPlayer = firstPlayer;
      }
    });

    function ajustarOrdenBye(pairings) {
      return pairings.map((emparejamiento) => {
        const { firstPlayer, secondPlayer } = emparejamiento;

        // Verificar si BYE está involucrado y ajustar el orden
        if (firstPlayer.id === 'BYE') {
          return {
            firstPlayer: secondPlayer,
            secondPlayer: firstPlayer,
          };
        } else if (secondPlayer.id === 'BYE') {
          return emparejamiento; // No es necesario cambiar el orden si BYE es el segundo jugador
        } else {
          return emparejamiento; // Mantener el orden original si BYE no está involucrado
        }
      });
    }

    return ajustarOrdenBye(pairings);

  }
}