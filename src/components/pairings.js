export function generarEmparejamientosSuizos(jugadores, emparejamientosPrevios) {
  const emparejamientos = [];
  const jugadoresUtilizados = new Set();

  // Ordenar jugadores por puntos y rendimiento
  jugadores && jugadores.sort((a, b) => b.points - a.points);

  // Función para verificar si un emparejamiento es válido
  const esEmparejamientoValido = (firstPlayer, secondPlayer) => {
    return !(
      jugadoresUtilizados.has(firstPlayer) ||
      jugadoresUtilizados.has(secondPlayer) ||
      emparejamientosPrevios.some(
        (emparejamiento) =>
          (emparejamiento.firstPlayer === firstPlayer && emparejamiento.secondPlayer === secondPlayer) ||
          (emparejamiento.firstPlayer === secondPlayer && emparejamiento.secondPlayer === firstPlayer)
      )
    );
  };

  // Generar emparejamientos
  if (jugadores) {
    for (let i = 0; i < jugadores.length; i++) {
      const firstPlayer = jugadores[i];

      // Buscar emparejamiento válido para el jugador actual
      let emparejamientoEncontrado = false;
      for (let j = i + 1; j < jugadores.length; j++) {
        const secondPlayer = jugadores[j];

        if (esEmparejamientoValido(firstPlayer, secondPlayer)) {
          emparejamientos.push({ firstPlayer, secondPlayer });
          jugadoresUtilizados.add(firstPlayer);
          jugadoresUtilizados.add(secondPlayer);
          emparejamientoEncontrado = true;
          break;
        }
      }

      // Si no se encontró un emparejamiento y es el último jugador, emparejarlo con BYE
      if (!emparejamientoEncontrado && i === jugadores.length - 1) {
        emparejamientos.push({ firstPlayer, secondPlayer: { name: 'BYE', surname: '' } });
        jugadoresUtilizados.add(firstPlayer);
      }
    }
  }

  return emparejamientos;
}
