"use client"
import React, { useState, useEffect } from 'react'
import { getSelectedTournament, updateSelectedTournament, updateTournaments } from '@/components/fileOperations'
import { FaChessPawn } from "react-icons/fa"
import { generarEmparejamientosSuizos } from '@/components/pairings'

import updateElo from '@/components/updateElo'

import updatePlayerStats from '@/components/functions/updatePlayerStats'

import Link from 'next/link'

const Start = () => {

  const [tournament, setTournament] = useState({})
  const [selectedRound, setSelectedRound] = useState({})
  const [rounds, setRounds] = useState([])
  const [pairings, setPairings] = useState([])
  const [winners, setWinners] = useState([])
  const [previousPairings, setPreviousPairings] = useState([])
  const [finalResults, setFinalResults] = useState([])
  const [results, setResults] = useState([])
  const [indexRound, setIndexRound] = useState(0)
  const [isNextRoundEnabled, setIsNextRoundEnabled] = useState(false)
  const [togglePairing, setTogglePairing] = useState(false)
  const [eloAverage, setEloAverage] = useState(1300)
  const [firstPlayersResults, setFirstPlayersResults] = useState(Array(pairings.length).fill(''))
  const [secondPlayersResults, setSecondPlayersResults] = useState(Array(pairings.length).fill(''))

  const handleFirstPlayersResults = (index, result) => {
    const newResults = [...firstPlayersResults]
    newResults[index] = result
    setFirstPlayersResults(newResults)
  }

  const handleSecondPlayersResults = (index, result) => {
    const newResults = [...secondPlayersResults]
    newResults[index] = result
    setSecondPlayersResults(newResults)
  }


  const handleResult = (index, winner) => {
    setWinners((prevWinners) => {
      const updatedWinners = [...prevWinners]
      const prevWinner = updatedWinners[index]

      if (prevWinner === 'firstPlayer' && winner !== 'firstPlayer') {
        // Restar puntos al primer jugador si ya había ganado previamente
        const firstPlayerIndex = selectedRound.playersRound.findIndex(
          (player) => player.id === pairings[index].firstPlayer.id
        )
        selectedRound.playersRound[firstPlayerIndex].points = 1
      } else if (prevWinner === 'secondPlayer' && winner !== 'secondPlayer') {
        // Restar puntos al segundo jugador si ya había ganado previamente
        const secondPlayerIndex = selectedRound.playersRound.findIndex(
          (player) => player.id === pairings[index].secondPlayer.id
        )
        selectedRound.playersRound[secondPlayerIndex].points = 1
      }

      // Actualizar el ganador
      updatedWinners[index] = winner
      // Sumar o restar puntos al jugador correspondiente
      const firstPlayerIndex = selectedRound.playersRound.findIndex(
        (player) => player.id === pairings[index].firstPlayer.id
      )
      const secondPlayerIndex = selectedRound.playersRound.findIndex(
        (player) => player.id === pairings[index].secondPlayer.id
      )



      if (winner === 'firstPlayer') {
        selectedRound.playersRound[firstPlayerIndex].points = 1 // Asignar 1 punto al primer jugador
        selectedRound.playersRound[secondPlayerIndex].points = 0
        if (tournament) {

          setSelectedRound({ ...selectedRound, winners: updatedWinners, firstPlayersResults: firstPlayersResults, secondPlayersResults: secondPlayersResults })
          setRounds(rounds.map((round, index) =>
            round.round === selectedRound.round
              ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
              : round
          ))
          setTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          })
          updateSelectedTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          })
          updateTournaments(tournament)
        }// Resetear puntos al segundo jugador
      } else if (winner === 'secondPlayer') {
        selectedRound.playersRound[secondPlayerIndex].points = 1 // Asignar 1 punto al segundo jugador
        selectedRound.playersRound[firstPlayerIndex].points = 0
        if (tournament) {
          setTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          })
          setSelectedRound({ ...selectedRound, winners: updatedWinners, firstPlayersResults: firstPlayersResults, secondPlayersResults: secondPlayersResults })
          setRounds(rounds.map((round, index) =>
            round.round === selectedRound.round
              ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
              : round
          ))
          updateSelectedTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          })
          updateTournaments(tournament)
        }// Resetear puntos al primer jugador
      } else if (winner === 'BYE') {
        selectedRound.playersRound[firstPlayerIndex].points = tournament.byeValue
        if (tournament) {
          setTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          })
          setSelectedRound({ ...selectedRound, winners: updatedWinners, firstPlayersResults: firstPlayersResults, secondPlayersResults: secondPlayersResults })
          setRounds(rounds.map((round, index) =>
            round.round === selectedRound.round
              ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
              : round
          ))
          updateSelectedTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          })
          updateTournaments(tournament)
        }
      } else {
        // En caso de draw, asignar 0.5 puntos a cada jugador
        selectedRound.playersRound[firstPlayerIndex].points = 0.5
        selectedRound.playersRound[secondPlayerIndex].points = 0.5
        if (tournament) {
          setTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          })
          setSelectedRound({ ...selectedRound, winners: updatedWinners, firstPlayersResults: firstPlayersResults, secondPlayersResults: secondPlayersResults })
          setRounds(rounds.map((round, index) =>
            round.round === selectedRound.round
              ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
              : round
          ))
          updateSelectedTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          })
          updateTournaments(tournament)
        }
      }
      return updatedWinners
    })
  }

  console.log(tournament.players)

  const rePair = () => {
    const prevPairings = rounds
      .filter(round => round.round !== selectedRound.round)
      .flatMap(round => round.pairings)
    setTogglePairing(!togglePairing);
    setFirstPlayersResults(Array(pairings.length).fill(''));
    setSecondPlayersResults(Array(pairings.length).fill(''))
    setPairings([])
    setPairings(generarEmparejamientosSuizos(results, prevPairings))
    setWinners([])
  }

  function formatFullname(nombre, apellido) {
    if (!nombre || !apellido) {
      return "BYE"
    }

    const nombreFormateado = nombre
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    const apellidoFormateado = apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase()

    const nombreCompletoFormateado = `${nombreFormateado} ${apellidoFormateado}`

    return nombreCompletoFormateado
  }

  function resetPairingPoints(pairings) {
    if (!Array.isArray(pairings)) {
      return
    }

    const pairingsConPuntosReseteados = pairings.map(pairing => ({
      firstPlayer: { ...pairing.firstPlayer, points: 0 },
      secondPlayer: { ...pairing.secondPlayer, points: 0 },
    }))

    return pairingsConPuntosReseteados
  }

  const obtenerIndiceRonda = (rondaActual) => {
    // Verifica que la ronda actual y su propiedad 'round' estén definidas
    if (rondaActual && rondaActual.round !== undefined) {
      const indiceRondaActual = rondaActual.round

      // Retorna el índice de la ronda anterior
      return indiceRondaActual > 0 ? indiceRondaActual - 1 : null
    }

    // Retorna null si la ronda actual no está definida o no tiene la propiedad 'round'
    return null
  }


  useEffect(() => {
    const selectedTournament = getSelectedTournament()
    setTournament({ ...selectedTournament, started: true })
    setRounds(selectedTournament.rounds);
    setSelectedRound(selectedTournament.rounds && selectedTournament.rounds[0])

    if (results.length > 0) {
      const resultadoFiltrado = resultado.filter(
        (player) => player.name !== 'BYE'
      )

      updateSelectedTournament({ ...tournament, players: resultadoFiltrado })
      updateTournaments(tournament)
    }
  }, [])

  useEffect(() => {
    if (tournament && tournament.players && selectedRound && rounds) {
      const playerPointsMap = {}

      rounds.forEach((round) => {
        round.playersRound.forEach((player) => {
          const playerId = player.id
          const playerPoints = player.points

          if (playerPointsMap[playerId] === undefined) {
            playerPointsMap[playerId] = {
              id: playerId,
              name: player.name,
              surname: player.surname,
              elo: player.elo,
              games: player.games,
              wins: player.wins,
              loses: player.loses,
              draws: player.draws,
              points: 0,
            }
          }

          playerPointsMap[playerId].points += playerPoints
        })
      })

      const resultado = Object.values(playerPointsMap)

      let resultadoFiltrado = resultado.filter((player) => player.name !== 'BYE')

      setFinalResults(resultadoFiltrado)

      // Comparar con tournament.players y ajustar los resultados por player.id
      const playersInTournament = tournament.players.map((tournamentPlayer) => tournamentPlayer.id)
      const playersInResultado = resultadoFiltrado.map((resultPlayer) => resultPlayer.id)

      // Agregar jugadores de tournament.players que no están en resultadoFiltrado por player.id
      tournament.players.forEach((tournamentPlayer) => {
        if (!playersInResultado.includes(tournamentPlayer.id)) {
          resultadoFiltrado.push({
            id: tournamentPlayer.id,
            name: tournamentPlayer.name,
            surname: tournamentPlayer.surname,
            elo: tournamentPlayer.elo,
            games: tournamentPlayer.games,
            wins: tournamentPlayer.wins,
            loses: tournamentPlayer.loses,
            draws: tournamentPlayer.draws,
            points: 0,
          })
        }
      })

      // Eliminar jugadores de resultadoFiltrado que no están en tournament.players por player.id
      resultadoFiltrado = resultadoFiltrado.filter((resultPlayer) =>
        playersInTournament.includes(resultPlayer.id)
      )

      setResults(resultadoFiltrado)
    }
  }, [tournament, rounds, tournament.players])

  useEffect(() => {

  }, [tournament.players])

  useEffect(() => {
    if (tournament && tournament.rounds && tournament.rounds.length > 0) {
      updateSelectedTournament(tournament)
      updateTournaments(tournament)
    }

    if (tournament && tournament.players) {
      const average = tournament.players.reduce((sum, player) => sum + player.elo, 0) / tournament.players.length

      setEloAverage(average)
    }

    if (tournament && tournament.players && rounds && rounds.length > indexRound + 1) {
      const nextRound = rounds[indexRound + 1]

      if (nextRound && selectedRound.started && !nextRound.started && !selectedRound.finished) {
        const updatedPlayers = tournament.players.map((player) => ({
          ...player,
          points: 0,
        }))

        setRounds((prevRounds) =>
          prevRounds.map((round) =>
            round.round === nextRound.round
              ? { ...round, playersRound: updatedPlayers }
              : round
          )
        )
      }
    }

  }, [tournament])

  useEffect(() => {

    setIndexRound(obtenerIndiceRonda(selectedRound))

    if (selectedRound && selectedRound.pairings && selectedRound.pairings.length > 0) {
      setPairings(selectedRound.pairings)
    }

    if (tournament && selectedRound && tournament.rounds && tournament.rounds.length > 0) {
      updateSelectedTournament({ ...tournament, rounds: rounds })
      updateTournaments({ ...tournament, rounds: rounds })
    }

    setWinners(selectedRound && selectedRound.winners)

    /*if (winners && winners.length > 0 && selectedRound && selectedRound.firstPlayersResults && selectedRound.firstPlayersResults.length > 0) {
      setFirstPlayersResults(selectedRound && selectedRound.firstPlayersResults)
    }*/

    if (tournament && Object.keys(tournament).length > 0) {
      updateSelectedTournament(tournament)
    }

    if (tournament && selectedRound && selectedRound.pairings && selectedRound.pairings.length === 0) {
      setSelectedRound({ ...selectedRound, pairings: pairings })
      setRounds(rounds.map((round) =>
        round.round === selectedRound.round
          ? { ...round, pairings: pairings }
          : round
      ))
    }


  }, [selectedRound])

  useEffect(() => {

    if (tournament && pairings.length && winners.length) {
      setTournament({ ...tournament, rounds: rounds })
    }

    if (tournament && winners && pairings && selectedRound && !selectedRound.finished) {
      const validResults = new Set(['secondPlayer', 'BYE', 'firstPlayer', 'draw'])

      const isValid =
        winners.length === pairings.length &&
        winners.every((result) => {
          const isResultValid = result !== null && result !== undefined && validResults.has(result)
          return isResultValid
        })
      setIsNextRoundEnabled(isValid)
    }

    if (winners && winners.length !== 0) {
      updateSelectedTournament(tournament)
    }

    updateTournaments(tournament)
    // NO TOCAR ACTUALIZA EL ESTADO DE LOS GANADORES

  }, [winners])

  useEffect(() => {

    if (tournament && selectedRound && Object.keys(selectedRound).length !== 0) {
      const roundIndex = tournament.rounds.findIndex((round) => round.round === selectedRound.round)

      if (roundIndex !== -1) {
        const updatedRounds = [...tournament.rounds]
        updatedRounds[roundIndex] = {
          ...selectedRound
        }
        setTournament(
          {
            ...tournament,
            rounds: updatedRounds,
          }
        )

        updateSelectedTournament({
          ...tournament,
          rounds: updatedRounds,
        })
      }
    }

    if (rounds && rounds.length > 0) {
      // Utiliza flatMap para obtener todos los pairings de cada ronda en un solo arreglo
      const prevPairings = rounds.flatMap(round => round.pairings)

      // Establece prevPairings en el estado (usando setPreviousPairings)
      setPreviousPairings(prevPairings)
    }

  }, [pairings, winners])

  useEffect(() => {
    if (selectedRound && selectedRound.playersRound && tournament && tournament.players) {
      setSelectedRound({
        ...selectedRound,
        winners: [],
        pairings: resetPairingPoints(pairings),
        playersRound: tournament.players.map(player => {
          return { ...player, points: 0 }
        })
      })

      if (selectedRound && selectedRound.playersRound && tournament && tournament.players) {
        setRounds(rounds.map((round) =>
          round.round === selectedRound.round
            ? {
              ...selectedRound,
              winners: [],
              pairings: resetPairingPoints(pairings),
              playersRound: tournament.players.map(player => {
                return { ...player, points: 0 }
              })
            } // Actualiza solo la ronda seleccionada
            : round
        ))
      }
    }


  }, [togglePairing])

  useEffect(() => {
    if (tournament && tournament.players && pairings) {
      let playersOne = tournament.players.length
      if (playersOne && Number(playersOne) % 2 !== 0) {
        playersOne++
      }

      let iterations = 0 // Agrega esta variable para evitar bucles infinitos

      while (tournament && tournament.players && playersOne / 2 !== pairings.length && iterations < 11125) {
        rePair()
        iterations++
      }
    }

  }, [pairings])

  const calculateEloChangeOnWin = (firstPlayer, secondPlayer, result, eloAverage) => {
    const eloChange = updateElo(firstPlayer, secondPlayer, result, eloAverage, tournament.byeValue);

    setUpdatePlayersElo((prevUpdatePlayersElo) => {
      return [...prevUpdatePlayersElo, [firstPlayer.id, eloChange]];
    });

    return isNaN(eloChange) ? '' : eloChange;
  };

  const calculateEloChange = (firstPlayer, secondPlayer, result, eloAverage) => {
    const eloChange = updateElo(firstPlayer, secondPlayer, result, eloAverage, tournament.byeValue);

    return isNaN(eloChange) ? '' : eloChange;
  };
  return (
    <>
      {tournament && !tournament.finished ? <><div className='startedTournamentContainer'>
        <div className='startedTournamentRoundsContainer'>
          <div>
            <div>
              {tournament &&
                tournament.rounds &&
                rounds &&
                rounds.map((round, index) => (
                  <div key={index}>
                    <p
                      className={`${selectedRound.round === round.round ? 'selectedRound' : ''
                        } ${index > 0 && !rounds[index].started ? 'disabledRound' : ''}`}
                      onClick={() => {
                        if (rounds[index].started) {
                          setSelectedRound(round)
                        }
                      }}
                    >{`Ronda ${index + 1}`}</p>
                  </div>
                ))}
            </div>
          </div>
          <button
            className={selectedRound && !selectedRound.finished && selectedRound.started ? 'buttonReemparejar' : 'd-none'}
            onClick={() => {
              rePair()
            }}
            disabled={selectedRound && selectedRound.finished && !selectedRound.started}
          >REEMPAREJAR</button>
        </div>
        <div className='startedTournamentPairing'>
          <div className='pairingContainer'>
            <ul>
              {pairings && pairings.map((pairing, index) => (
                <div key={index} className='pairingsDivLiContainer'><span>{index + 1}</span><li >
                  {pairing.firstPlayer && pairing.secondPlayer && (
                    <>
                      <span>{pairing && pairing.firstPlayer && pairing.firstPlayer.name && pairing.firstPlayer.surname ? formatFullname(pairing.firstPlayer.name, pairing.firstPlayer.surname) : ''}{firstPlayersResults[index] ? <span className={calculateEloChange(pairing.firstPlayer, pairing.secondPlayer, firstPlayersResults[index], eloAverage) >= 0 ? 'greenElo' : 'redElo'}>
                        {calculateEloChange(pairing.firstPlayer, pairing.secondPlayer, firstPlayersResults[index], eloAverage) > 0 && '+'}
                        {calculateEloChange(pairing.firstPlayer, pairing.secondPlayer, firstPlayersResults[index], eloAverage)}
                      </span> : <span></span>}</span>
                      <span>
                        {pairing.secondPlayer.name !== 'BYE' ? <><button
                          onClick={() => {
                            handleResult(index, 'firstPlayer')
                            handleFirstPlayersResults(index, 'win')
                            handleSecondPlayersResults(index, 'lose')
                          }}
                          className={winners[index] === 'firstPlayer' ? "selectedWinner" : ""}
                          disabled={selectedRound.finished}
                        >
                          <FaChessPawn />
                        </button>
                          <button
                            onClick={() => {
                              handleResult(index, 'draw')
                              handleFirstPlayersResults(index, 'draw')
                              handleSecondPlayersResults(index, 'draw')
                            }}
                            className={`${winners[index] === 'draw' ? "selectedWinner" : ''} ${selectedRound.finished ? 'changeResultsButton' : ''}`}
                            disabled={selectedRound.finished}
                          >1/2</button>
                          <button
                            onClick={() => {
                              handleResult(index, 'secondPlayer')
                              handleFirstPlayersResults(index, 'lose')
                              handleSecondPlayersResults(index, 'win')
                            }}
                            className={winners[index] === 'secondPlayer' ? "selectedWinner" : ""}
                            disabled={selectedRound.finished}
                          >
                            <FaChessPawn />
                          </button>
                        </> : <button onClick={() => {
                          handleResult(index, 'BYE')
                          handleFirstPlayersResults(index, 'BYE')
                          handleSecondPlayersResults(index, 'BYE')
                        }}
                          disabled={selectedRound.finished} className={winners[index] === 'BYE' ? "selectedBye" : "byeButton"}>BYE</button>}
                      </span>
                      <span>{secondPlayersResults[index] ? <span className={pairing.secondPlayer.name !== 'BYE' && calculateEloChange(pairing.secondPlayer, pairing.firstPlayer, secondPlayersResults[index], eloAverage) >= 0 ? 'greenElo' : 'redElo'}>
                        {pairing.secondPlayer.name !== 'BYE' &&
                          calculateEloChange(pairing.secondPlayer, pairing.firstPlayer, secondPlayersResults[index], eloAverage) > 0 && '+'}
                        {pairing.secondPlayer.name !== 'BYE' &&
                          calculateEloChange(pairing.secondPlayer, pairing.firstPlayer, secondPlayersResults[index], eloAverage)}
                      </span> : <span></span>}{formatFullname(pairing.secondPlayer.name, pairing.secondPlayer.surname)}</span>
                    </>
                  )}
                </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div className='startedTournamentResults'>
          <ul>
            <li>
              <span>Jugador</span>
              <span className='armozaEloStartedTournament'>ELO<i>Armoza</i></span>
              <span>Puntos</span>
            </li>
            <div>
              {results && finalResults &&
                finalResults
                  .slice()
                  .sort((a, b) => b.points - a.points)
                  .map((player, index) => (
                    <li key={index}>
                      <span><span className='tournamentResultsPositions'>{index + 1}</span>{formatFullname(player.name, player.surname)}</span>
                      <span className='playerEloFinalResults'>{player.elo}{player.games < 6 ? '?' : ''}</span>
                      <span className='finalResultsPoints'>{player.points}</span>
                    </li>
                  ))}
            </div>

          </ul>
          <div className='nextRoundContainer'>
            {selectedRound && !selectedRound.finished && !selectedRound.isLast ? (<button
              className={!isNextRoundEnabled ? 'nextRoundDisabled' : 'nextRound'}
              onClick={() => {

                setSelectedRound({ ...selectedRound, pairings: pairings, winners: winners, firstPlayersResults: firstPlayersResults, secondPlayersResults: secondPlayersResults })


                const players = updatePlayerStats(tournament.players, winners, pairings, eloAverage, tournament.byeValue)

                const nextRound = rounds.find((_, index) => index === indexRound + 1);
                setRounds((prevRounds) =>
                  prevRounds.map((round) => {
                    if (round.round === selectedRound.round) {
                      return { ...selectedRound, finished: true, winners: winners, playersRound: selectedRound.playersRound.map((p) => {
                        const matchingPlayer = players.find((player) => player.id === p.id);
                        return matchingPlayer ? { ...p, elo: matchingPlayer.elo } : p;
                      }), };
                    } else if (round === nextRound) {
                      const updatedNextRound = {
                        ...nextRound,
                        started: true,
                      };
                      return updatedNextRound;
                    } else {
                      return { ...round, playersRound: players };
                    }
                  })
                );

                setPairings(generarEmparejamientosSuizos(results, previousPairings))
                setSelectedRound({ ...nextRound, started: true })


                updateSelectedTournament({ ...tournament, rounds: rounds, players: players })
                updateTournaments({ ...tournament, rounds: rounds, players: players })


                setFirstPlayersResults(Array(pairings.length).fill(''));
                setSecondPlayersResults(Array(pairings.length).fill(''))

              }}
              disabled={!isNextRoundEnabled}
            >
              SIGUIENTE RONDA
            </button>)
              : selectedRound && selectedRound.isLast && isNextRoundEnabled ?
                <Link
                  href="/torneos"
                  onClick={() => {
                    setTournament({ ...tournament, winner: results[0], finished: true, results: finalResults })
                    updateSelectedTournament({ ...tournament, rounds: rounds })
                    updateTournaments({ ...tournament, rounds: rounds })
                  }}
                  className='nextRound'
                >
                  TERMINAR TORNEO
                </Link> : ''}
          </div>
        </div>
      </div></> : ''}</>
  )
}

export default Start
