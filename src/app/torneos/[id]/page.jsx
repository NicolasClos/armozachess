"use client"

import React, { useState, useEffect } from 'react'

import { getSelectedTournament } from '../../../components/fileOperations';

const Start = () => {

  const [tournament, setTournament] = useState({})

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
        <h4>EMPAREJAMIENTO</h4>
      </div>
      <div className='startedTournamentResults'>
        <h4>RESULTADOS</h4>
        {
          tournament.results && tournament.results.map((player)=>{
            <li><span>{player.name + player.surname} </span><span>{player.points}</span></li>
          })
        }
      </div>
    </div>
  )
}

export default Start
