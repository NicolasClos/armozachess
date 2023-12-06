export function generarEmparejamientosSuizos(jugadores, emparejamientosPrevios) {
  const emparejamientos = [];
  let players = jugadores.slice();
  const jugadoresUtilizados = new Set();

  const obtenerPermutacionAleatoria = (array) =>
    array.slice().sort(() => Math.random() - 0.5);

  players = obtenerPermutacionAleatoria(players);

  const haTenidoBYE = (jugador, emparejamientosPrevios) =>
    emparejamientosPrevios.some(
      (emparejamiento) =>
        emparejamiento.firstPlayer === jugador ||
        (emparejamiento.secondPlayer === jugador && emparejamiento.secondPlayer.name !== 'BYE')
    );

  const haJugadoEntreEllos = (firstPlayer, secondPlayer, emparejamientosPrevios) =>
    emparejamientosPrevios.some(
      (emparejamiento) =>
        (emparejamiento.firstPlayer === firstPlayer.id && emparejamiento.secondPlayer === secondPlayer.id) ||
        (emparejamiento.firstPlayer === secondPlayer.id && emparejamiento.secondPlayer === firstPlayer.id)
    );

  const esEmparejamientoValido = (firstPlayer, secondPlayer) => {
    return !(
      jugadoresUtilizados.has(firstPlayer) ||
      jugadoresUtilizados.has(secondPlayer) ||
      haTenidoBYE(firstPlayer, emparejamientosPrevios) ||
      haTenidoBYE(secondPlayer, emparejamientosPrevios) ||
      haJugadoEntreEllos(firstPlayer, secondPlayer, emparejamientosPrevios)
    );
  };

  if (players) {
    if (players.length % 2 !== 0) {
      const byePlayer = { name: 'BYE', surname: '' };
      players.push(byePlayer);
    }

    let jugadorAnterior = null;

    for (let i = 0; i < players.length - 1; i++) {
      const firstPlayer = players[i];
      let emparejamientoEncontrado = false;

      for (let j = i + 1; j < players.length; j++) {
        const secondPlayer = players[j];

        if (esEmparejamientoValido(firstPlayer, secondPlayer) &&
          (jugadorAnterior === null || jugadorAnterior !== firstPlayer)) {
          emparejamientos.push({ firstPlayer, secondPlayer });
          jugadoresUtilizados.add(firstPlayer);
          jugadoresUtilizados.add(secondPlayer);
          jugadorAnterior = secondPlayer;
          emparejamientoEncontrado = true;
          break;
        }
      }

      if (!emparejamientoEncontrado) {
        // Si no se encontró un emparejamiento en la primera iteración, realizar una búsqueda más exhaustiva
        for (let j = 0; j < players.length; j++) {
          const secondPlayer = players[j];

          if (esEmparejamientoValido(firstPlayer, secondPlayer) &&
            (jugadorAnterior === null || jugadorAnterior !== firstPlayer)) {
            emparejamientos.push({ firstPlayer, secondPlayer });
            jugadoresUtilizados.add(firstPlayer);
            jugadoresUtilizados.add(secondPlayer);
            jugadorAnterior = secondPlayer;
            break;
          }
        }
      }
    }

    return emparejamientos;
  }
}
