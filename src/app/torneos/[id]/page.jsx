"use client"

import React, { useState, useEffect } from 'react'

import { getSelectedTournament } from '@/components/fileOperations';

import Matchmaking from '@/components/Matchmaking'

const Start = () => {

  const [tournament, setTournament] = useState({})

  const [selectedRound, setSelectedRound] = useState({})

  const [rounds, setRounds] = useState({})

  useEffect(() => {
    setTournament(getSelectedTournament());
    setRounds(tournament.rounds);
  }, [])

  useEffect(()=>{
    setRounds(tournament.rounds)
    setSelectedRound(tournament.rounds && tournament.rounds[0])
  }, [tournament])

  // console.log(selectedRound)

  return (
    <div className='startedTournamentContainer'>
      <div className='startedTournamentRoundsContainer'>
        <div>
          {
            tournament && tournament.rounds && rounds &&
            rounds.map((round, index) => (
              <div key={index}>
                <p className={selectedRound === round ? 'selectedRound' : ''}
                onClick={()=>{
                  setSelectedRound(round)
                }}>{'Ronda ' + (index + 1)}</p>
              </div>
            ))
          }
        </div>
        <div>
          <button>VER RESULTADO FINAL</button>
        </div>

      </div>
      <div className='startedTournamentPairing'>
        <Matchmaking players={selectedRound && selectedRound.playersRound} prevPairings={selectedRound && selectedRound.pairings} />
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
                .map((player, index) => (
                  <li key={index}>
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
