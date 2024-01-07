import updateElo from "../updateElo";

export default function updatePlayerStats(players, winners, pairings, tournamentEloAverage, byeValue) {
    const updatedPlayers = [...players];
  
    pairings.forEach((pairing, index) => {
      const winner = winners[index];
      const firstPlayer = updatedPlayers.find((player) => player.id === pairing.firstPlayer.id);
      const secondPlayer = updatedPlayers.find((player) => player.id === pairing.secondPlayer.id);
  
      if (secondPlayer && secondPlayer.name !== 'BYE') {
        // Ignorar al jugador que es secondPlayer con nombre 'BYE'
        const isDraw = winner === 'draw';
        const isFirstPlayerWinner = winner === 'firstPlayer';
        const isSecondPlayerWinner = winner === 'secondPlayer';
  
        if (isFirstPlayerWinner) {
          firstPlayer.wins++;
          secondPlayer.loses++;
        } else if (isSecondPlayerWinner) {
          secondPlayer.wins++;
          firstPlayer.loses++;
        } else if (isDraw) {
          firstPlayer.draws++;
          secondPlayer.draws++;
        }
  
        // Incrementar el contador de juegos para ambos jugadores
        firstPlayer.games++;
        secondPlayer.games++;
  
        // Modificar el ELO usando la función updateElo
        const eloChangeFirst = updateElo(firstPlayer, secondPlayer, isFirstPlayerWinner ? 'win' : isSecondPlayerWinner ? 'lose' : 'draw');
        const eloChangeSecond = updateElo(secondPlayer, firstPlayer, isSecondPlayerWinner ? 'win' : isFirstPlayerWinner ? 'lose' : 'draw');
        firstPlayer.elo += eloChangeFirst;
        secondPlayer.elo += eloChangeSecond;
      }else{
        const eloChangeFirst = updateElo(firstPlayer, secondPlayer, 'BYE', tournamentEloAverage, byeValue);
        firstPlayer.games++;
        firstPlayer.elo += eloChangeFirst;
      }
    })
  
    return updatedPlayers;
  }
  