export function generarEmparejamientosSuizos(roundPlayers, prevPairings) {
  // DEFINO VARIABLES

  let pairings = [];
  let usedPairings = [];
  let usedPlayers = new Set();
  let players = roundPlayers.slice();

  // USED PAIRINGS SON TODOS LOS EMPAREJAMIENTOS QUE YA NO PUEDEN HABER, SI NICOLAS JUGO CON ROCIO, ROCIO YA NO PUEDE JUGAR CON NICOLAS, EN NINGUN ORDEN.

  const reversePrevPairings = prevPairings.map(emparejamiento => {
    return {
      "firstPlayer": emparejamiento.secondPlayer,
      "secondPlayer": emparejamiento.firstPlayer
    };
  });

  usedPairings.push(...prevPairings);
  usedPairings.push(...reversePrevPairings);

  console.log(usedPairings);

  // DESOREDENA LOS JUGADORES Y LOS ORDENA POR PUNTOS (INICIALMENTE ENTONCES EVITA QUE SEA EN ORDEN EN QUE SE AGREGARON LOS JGUADORES)

  const obtenerPermutacionAleatoria = (array) =>
    array.slice().sort(() => Math.random() - 0.5);

  players = obtenerPermutacionAleatoria(players).sort((a, b) => b.points - a.points);

  // EVALUACION DE CONDICIONES POR FUNCION

  const hanJugadoEntreEllos = (firstPlayer, secondPlayer, usedPairings) =>
    usedPairings.some(
      (emparejamiento) =>
        (emparejamiento.firstPlayer.id === firstPlayer.id && emparejamiento.secondPlayer.id === secondPlayer.id) ||
        (emparejamiento.firstPlayer.id === secondPlayer.id && emparejamiento.secondPlayer.id === firstPlayer.id)
    );

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

    while (players.length / 2 !== pairings.length) {
      // Reinicia las variables antes de cada intento del bucle while
      pairings = [];
      usedPlayers = new Set();

      let previousPlayer = null;
      for (let i = 0; i < players.length - 1; i++) {
        const firstPlayer = players[i];
        let pairingFound = false;

        for (let j = i + 1; j < players.length; j++) {
          const secondPlayer = players[j];

          if (esEmparejamientoValido(firstPlayer, secondPlayer) &&
            (previousPlayer === null || previousPlayer !== firstPlayer)) {
            pairings.push({ firstPlayer, secondPlayer });
            usedPlayers.add(firstPlayer.id);
            usedPlayers.add(secondPlayer.id);
            previousPlayer = firstPlayer;
            pairingFound = true;
            break;
          }
        }
      }
    }

    return pairings;
  }
}
