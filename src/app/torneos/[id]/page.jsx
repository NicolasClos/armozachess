"use client"

import React, { useState, useEffect } from 'react'

import { getSelectedTournament } from '@/components/fileOperations';

import Matchmaking from '@/components/Matchmaking'

const Start = () => {

  const [tournament, setTournament] = useState({})

  const [selectedRound, setSelectedRound] = useState({})

  useEffect(() => {
    setTournament(getSelectedTournament());
  }, [])

  return (
    <div className='startedTournamentContainer'>
      <div className='startedTournamentRoundsContainer'>
        <div>
          {
            tournament && tournament.rounds &&
            Number.isInteger(parseFloat(tournament.rounds)) &&
            Array(parseInt(tournament.rounds, 10)).fill().map((_, index) => (
              <p key={index}>{'Ronda ' + (index + 1)}</p>
            ))
          }
        </div>
        <div>
          <button>VER RESULTADO FINAL</button>
        </div>

      </div>
      <div className='startedTournamentPairing'>
        <Matchmaking players={tournament && tournament.players} />
      </div>
      <div className='startedTournamentResults'>
        <ul>
          <li><span>Jugador</span><span>Puntaje</span></li>
          <div>
            {
              tournament.players &&
              tournament.players
                .slice() // Crear una copia del array para no modificar el original
                .sort((a, b) => b.points - a.points) // Ordenar por puntos de mayor a menor
                .map((player) => (
                  <li key={player.id}>
                    <span>{player.name} {player.surname}</span>
                    <span>{player.points}</span>
                  </li>
                ))
            }
          </div>

        </ul>

      </div>

    </div>
  )
}

export default Start
