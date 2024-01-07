"use client"

import React, { useState, useEffect } from 'react'

import { getTournaments } from '@/components/fileOperations';

import Chart from '@/components/chart'

export default function Stats() {

    const [tournaments, setTournaments] = useState([])

    const [players, setPlayers] = useState([])

    useEffect(()=>{
        // tournaments va a ser unicamente los torneos que hayan terminado, las estadisticas son en base a torneos terminados
        setTournaments(getTournaments().filter(tournament => tournament.finished === true));
    }, [])

    useEffect(() => {
        const playerIdsSet = new Set();
        const allPlayers = tournaments.reduce((allPlayers, tournament) => {
          // Filtrar jugadores repetidos basados en el ID
          const uniquePlayers = tournament.players.filter(player => {
            if (!playerIdsSet.has(player.id)) {
              playerIdsSet.add(player.id);
              return true;
            }
            return false;
          });
      
          return allPlayers.concat(uniquePlayers);
        }, []);
      
        setPlayers(allPlayers);
      }, [tournaments]);

    console.log(players)

    return (
        <div>
            STATS
            <Chart labels={players}/>
        </div>
    )
}
