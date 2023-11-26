export function generarEmparejamientosSuizos(jugadores, emparejamientosPrevios) {
    const emparejamientos = [];
    const jugadoresUtilizados = new Set();
  
    // Ordenar jugadores por puntos y rendimiento
    jugadores && jugadores.sort((a, b) => b.points - a.points)
  
    // Función para verificar si un emparejamiento es válido
    const esEmparejamientoValido = (jugador1, jugador2) => {
      return !(
        jugadoresUtilizados.has(jugador1) ||
        jugadoresUtilizados.has(jugador2) ||
        emparejamientosPrevios.some(
          (emparejamiento) =>
            (emparejamiento.jugador1 === jugador1 && emparejamiento.jugador2 === jugador2) ||
            (emparejamiento.jugador1 === jugador2 && emparejamiento.jugador2 === jugador1)
        )
      );
    };
  
    // Generar emparejamientos
    if(jugadores){
        for (let i = 0; i < jugadores.length; i++) {
            const jugador1 = jugadores[i];
        
            // Buscar emparejamiento válido para el jugador actual
            let emparejamientoEncontrado = false;
            for (let j = i + 1; j < jugadores.length; j++) {
              const jugador2 = jugadores[j];
        
              if (esEmparejamientoValido(jugador1, jugador2)) {
                emparejamientos.push({ jugador1, jugador2 });
                jugadoresUtilizados.add(jugador1);
                jugadoresUtilizados.add(jugador2);
                emparejamientoEncontrado = true;
                break;
              }
            }
        
            // Si no se encontró un emparejamiento, agregar el jugador a la lista de utilizados
            if (!emparejamientoEncontrado) {
              jugadoresUtilizados.add(jugador1);
            }
          }
    }
  
    return emparejamientos;
  }