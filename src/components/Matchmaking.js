import React, { useState, useEffect } from 'react';
import { FaChessPawn } from "react-icons/fa";
import { generarEmparejamientosSuizos } from './pairings';

import { getSelectedTournament, updateSelectedTournament, updateTournamentPlayers } from './fileOperations';

const Matchmaking = ({ players, prevPairings }) => {
  const [pairings, setPairings] = useState([]);
  const [winners, setWinners] = useState([]); 

  const [tournament, setTournament] = useState({})

  useEffect(() => {
    setTournament(getSelectedTournament());
  }, [])

  useEffect(() => {
    setPairings(generarEmparejamientosSuizos(players, prevPairings));
  }, [players, prevPairings]);

  const handleResult = (index, winner) => {
    setWinners((prevWinners) => {
      const updatedWinners = [...prevWinners];
      const prevWinner = updatedWinners[index];
      if (prevWinner === 'firstPlayer' && winner !== 'firstPlayer') {
        // Restar puntos al primer jugador si ya había ganado previamente
        const firstPlayerIndex = tournament.players.findIndex(
          (player) => player.id === pairings[index].firstPlayer.id
        );
        tournament.players[firstPlayerIndex].points -= 1;
      } else if (prevWinner === 'secondPlayer' && winner !== 'secondPlayer') {
        // Restar puntos al segundo jugador si ya había ganado previamente
        const secondPlayerIndex = tournament.players.findIndex(
          (player) => player.id === pairings[index].secondPlayer.id
        );
        tournament.players[secondPlayerIndex].points -= 1;
      }
  
      // Actualizar el ganador
      updatedWinners[index] = winner;
  
      // Sumar o restar puntos al jugador correspondiente
      const firstPlayerIndex = tournament.players.findIndex(
        (player) => player.id === pairings[index].firstPlayer.id
      );
      const secondPlayerIndex = tournament.players.findIndex(
        (player) => player.id === pairings[index].secondPlayer.id
      );
  
      if (winner === 'firstPlayer') {
        tournament.players[firstPlayerIndex].points = 1; // Asignar 1 punto al primer jugador
        tournament.players[secondPlayerIndex].points = 0; 
        if(tournament){
          updateTournamentPlayers(tournament, players)
          // updateSelectedTournament(tournament)
        }// Resetear puntos al segundo jugador
      } else if (winner === 'secondPlayer') {
        tournament.players[secondPlayerIndex].points = 1; // Asignar 1 punto al segundo jugador
        tournament.players[firstPlayerIndex].points = 0; 
        if(tournament){
          updateTournamentPlayers(tournament, players)
        }// Resetear puntos al primer jugador
      } else {
        // En caso de empate, asignar 0.5 puntos a cada jugador
        tournament.players[firstPlayerIndex].points = 0.5;
        tournament.players[secondPlayerIndex].points = 0.5;
        if(tournament){
          updateTournamentPlayers(tournament, players)
        }
      }
  
      return updatedWinners;
    });
    
  };
  


  return (
    <div className='pairingContainer'>
      <h2>EMPAREJAMIENTO - RONDA </h2>
      <ul>
        {pairings && pairings.map((pairing, index) => (
          <li key={index}>
            {pairing.firstPlayer && pairing.secondPlayer && (
              <>
                <span>{`${pairing.firstPlayer.name} ${pairing.firstPlayer.surname}`}</span>
                <span>
                  <button 
                  onClick={() => {
                    handleResult(index, 'firstPlayer')
                  }}
                  className={winners[index]==='firstPlayer' ? "selectedWinner" : ""}
                  >
                    <FaChessPawn />
                  </button>
                  <button 
                  onClick={() => handleResult(index, 'empate')}
                  className={winners[index]==='empate' ? "selectedWinner" : ""}
                  >1/2</button>
                  <button 
                  onClick={() => handleResult(index, 'secondPlayer')}
                  className={winners[index]==='secondPlayer' ? "selectedWinner" : ""}
                  >
                    <FaChessPawn />
                  </button>
                </span>
                <span>{`${pairing.secondPlayer.name} ${pairing.secondPlayer.surname ? pairing.secondPlayer.surname : ''}`}</span>
              </>
            )}
          </li>
        ))}
      </ul>
      <button className='nextRound'>SIGUIENTE RONDA</button>
    </div>
  );
};

export default Matchmaking;
