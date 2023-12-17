"use client"
import React, { useState, useEffect } from 'react';
import { getSelectedTournament, updateSelectedTournament, updateTournaments } from '@/components/fileOperations';
import { FaChessPawn } from "react-icons/fa";
import { generarEmparejamientosSuizos } from '@/components/pairings';

import Link from 'next/link'

const Start = () => {

  const [tournament, setTournament] = useState({});
  const [selectedRound, setSelectedRound] = useState({});
  const [rounds, setRounds] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [winners, setWinners] = useState([]);
  const [previousPairings, setPreviousPairings] = useState([])
  const [finalResults, setFinalResults] = useState([])
  const [results, setResults] = useState([])
  const [indexRound, setIndexRound] = useState(0)
  const [isNextRoundEnabled, setIsNextRoundEnabled] = useState(false);
  const [togglePairing, setTogglePairing] = useState(false);


  const handleResult = (index, winner) => {
    setWinners((prevWinners) => {
      const updatedWinners = [...prevWinners];
      const prevWinner = updatedWinners[index];

      if (prevWinner === 'firstPlayer' && winner !== 'firstPlayer') {
        // Restar puntos al primer jugador si ya había ganado previamente
        const firstPlayerIndex = selectedRound.playersRound.findIndex(
          (player) => player.id === pairings[index].firstPlayer.id
        );
        selectedRound.playersRound[firstPlayerIndex].points = 1;
      } else if (prevWinner === 'secondPlayer' && winner !== 'secondPlayer') {
        // Restar puntos al segundo jugador si ya había ganado previamente
        const secondPlayerIndex = selectedRound.playersRound.findIndex(
          (player) => player.id === pairings[index].secondPlayer.id
        );
        selectedRound.playersRound[secondPlayerIndex].points = 1;
      }

      // Actualizar el ganador
      updatedWinners[index] = winner;
      // Sumar o restar puntos al jugador correspondiente
      const firstPlayerIndex = selectedRound.playersRound.findIndex(
        (player) => player.id === pairings[index].firstPlayer.id
      );
      const secondPlayerIndex = selectedRound.playersRound.findIndex(
        (player) => player.id === pairings[index].secondPlayer.id
      );

      if (winner === 'firstPlayer') {
        selectedRound.playersRound[firstPlayerIndex].points = 1; // Asignar 1 punto al primer jugador
        selectedRound.playersRound[secondPlayerIndex].points = 0;
        if (tournament) {

          setSelectedRound({ ...selectedRound, winners: updatedWinners })
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
          });
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
        selectedRound.playersRound[secondPlayerIndex].points = 1; // Asignar 1 punto al segundo jugador
        selectedRound.playersRound[firstPlayerIndex].points = 0;
        if (tournament) {
          setTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          });
          setSelectedRound({ ...selectedRound, winners: updatedWinners })
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
        selectedRound.playersRound[firstPlayerIndex].points = tournament.byeValue;
        if (tournament) {
          setTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          });
          setSelectedRound({ ...selectedRound, winners: updatedWinners })
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
        // En caso de empate, asignar 0.5 puntos a cada jugador
        selectedRound.playersRound[firstPlayerIndex].points = 0.5;
        selectedRound.playersRound[secondPlayerIndex].points = 0.5;
        if (tournament) {
          setTournament({
            ...tournament,
            rounds: tournament.rounds.map((round, index) =>
              index === selectedRound
                ? { ...round, winners: updatedWinners } // Actualiza solo la ronda seleccionada
                : round
            ),
          });
          setSelectedRound({ ...selectedRound, winners: updatedWinners })
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
      return updatedWinners;
    });
  };

  function ordenarPairings(currentPairings) {
    // Contar la cantidad de veces que cada jugador ha jugado como firstPlayer o secondPlayer
    const countMap = new Map();

    // Función para contar la frecuencia de cada jugador
    const contarFrecuencia = jugador => {
      const key = `${jugador.id}-${jugador.name}-${jugador.surname}`;
      countMap.set(key, (countMap.get(key) || 0) + 1);
    };

    // Contar la frecuencia en los pairings previos
    previousPairings.forEach(pairing => {
      contarFrecuencia(pairing.firstPlayer);
      contarFrecuencia(pairing.secondPlayer);
    });

    // Contar la frecuencia en los pairings actuales
    currentPairings.forEach(pairing => {
      contarFrecuencia(pairing.firstPlayer);
      contarFrecuencia(pairing.secondPlayer);
    });

    // Función para comparar la frecuencia de dos jugadores
    const compararFrecuencia = (jugadorA, jugadorB) => {
      const keyA = `${jugadorA.id}-${jugadorA.name}-${jugadorA.surname}`;
      const keyB = `${jugadorB.id}-${jugadorB.name}-${jugadorB.surname}`;
      return countMap.get(keyB) - countMap.get(keyA);
    };

    // Ordenar los pairings actuales según la frecuencia de los jugadores
    const pairingsOrdenados = currentPairings.sort((a, b) => {
      const comparacionFirst = compararFrecuencia(a.firstPlayer, b.firstPlayer);
      const comparacionSecond = compararFrecuencia(a.secondPlayer, b.secondPlayer);
      return comparacionFirst || comparacionSecond;
    });

    return pairingsOrdenados;
  }

  function resetPairingPoints(pairings) {
    if (!Array.isArray(pairings)) {
      return;
    }

    const pairingsConPuntosReseteados = pairings.map(pairing => ({
      firstPlayer: { ...pairing.firstPlayer, points: 0 },
      secondPlayer: { ...pairing.secondPlayer, points: 0 },
    }));

    return pairingsConPuntosReseteados;
  }

  const obtenerIndiceRonda = (rondaActual) => {
    // Verifica que la ronda actual y su propiedad 'round' estén definidas
    if (rondaActual && rondaActual.round !== undefined) {
      const indiceRondaActual = rondaActual.round;

      // Retorna el índice de la ronda anterior
      return indiceRondaActual > 0 ? indiceRondaActual - 1 : null;
    }

    // Retorna null si la ronda actual no está definida o no tiene la propiedad 'round'
    return null;
  };

  useEffect(() => {
    const selectedTournament = getSelectedTournament();
    setTournament({ ...selectedTournament, started: true });
    setRounds(selectedTournament.rounds);
    setSelectedRound(selectedTournament.rounds && selectedTournament.rounds[0]);

    if (results.length > 0) {
      const resultadoFiltrado = resultado.filter(
        (player) => player.name !== 'BYE'
      );

      updateSelectedTournament({ ...tournament, players: resultadoFiltrado })
      updateTournaments(tournament)
    }
  }, []);

  useEffect(() => {
    if (tournament && tournament.players && selectedRound && rounds) {
      const playerPointsMap = {};

      rounds.forEach((round) => {
        round.playersRound.forEach((player) => {
          const playerId = player.id;
          const playerPoints = player.points;

          if (playerPointsMap[playerId] === undefined) {
            playerPointsMap[playerId] = {
              id: playerId,
              name: player.name,
              surname: player.surname,
              points: 0,
            };
          }

          playerPointsMap[playerId].points += playerPoints;
        });
      });

      const resultado = Object.values(playerPointsMap);

      let resultadoFiltrado = resultado.filter((player) => player.name !== 'BYE');

      setFinalResults(resultadoFiltrado)

      // Comparar con tournament.players y ajustar los resultados
      const playersInTournament = tournament.players.map((tournamentPlayer) => tournamentPlayer.name);
      const playersInResultado = resultadoFiltrado.map((resultPlayer) => resultPlayer.name);

      // Agregar jugadores de tournament.players que no están en resultadoFiltrado
      tournament.players.forEach((tournamentPlayer) => {
        if (!playersInResultado.includes(tournamentPlayer.name)) {
          resultadoFiltrado.push({
            id: tournamentPlayer.id,
            name: tournamentPlayer.name,
            surname: tournamentPlayer.surname,
            points: 0,
          });
        }
      });

      // Eliminar jugadores de resultadoFiltrado que no están en tournament.players
      resultadoFiltrado = resultadoFiltrado.filter((resultPlayer) =>
        playersInTournament.includes(resultPlayer.name)
      );

      setResults(resultadoFiltrado);
    }
  }, [tournament, rounds]);

  useEffect(() => {
    if (tournament && tournament.rounds && tournament.rounds.length > 0) {
      updateSelectedTournament(tournament)
      updateTournaments(tournament)
    }

    if (tournament && tournament.players && rounds && rounds.length > indexRound + 1) {
      const nextRound = rounds[indexRound + 1];

      if (nextRound && selectedRound.started && !nextRound.started && !selectedRound.finished) {
        const updatedPlayers = tournament.players.map((player) => ({
          ...player,
          points: 0,
        }));

        setRounds((prevRounds) =>
          prevRounds.map((round) =>
            round.round === nextRound.round
              ? { ...round, playersRound: updatedPlayers }
              : round
          )
        );
      }
    }

    if (tournament && tournament.players) {
      setFinalResults((prevFinalResults) => {
        const uniqueResults = [...prevFinalResults];

        results.forEach((result) => {
          if (result && result.id && !uniqueResults.some((prevResult) => prevResult.id === result.id)) {
            uniqueResults.push(result);
          }
        });

        return new Set(uniqueResults);
      });
    }
  }, [tournament])

  useEffect(() => {

    setIndexRound(obtenerIndiceRonda(selectedRound));

    if (selectedRound && selectedRound.pairings && selectedRound.pairings.length > 0) {
      setPairings(selectedRound.pairings);
    }

    if (tournament && selectedRound && tournament.rounds && tournament.rounds.length > 0) {
      updateSelectedTournament({ ...tournament, rounds: rounds })
      updateTournaments({ ...tournament, rounds: rounds })
    }

    setWinners(selectedRound && selectedRound.winners)

    if (tournament && Object.keys(tournament).length > 0) {
      updateSelectedTournament(tournament)
    }

    if (tournament && selectedRound && selectedRound.pairings && selectedRound.pairings.length === 0) {
      setSelectedRound({ ...selectedRound, pairings: pairings });
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
      const validResults = new Set(['secondPlayer', 'BYE', 'firstPlayer', 'empate']);

      const isValid =
        winners.length === pairings.length &&
        winners.every((result) => {
          const isResultValid = result !== null && result !== undefined && validResults.has(result);
          return isResultValid;
        });
      setIsNextRoundEnabled(isValid);
    }

    if (winners && winners.length !== 0) {
      updateSelectedTournament(tournament)
    }

    updateTournaments(tournament);
    // NO TOCAR ACTUALIZA EL ESTADO DE LOS GANADORES

  }, [winners])

  useEffect(() => {

    if (tournament && selectedRound && Object.keys(selectedRound).length !== 0) {
      const roundIndex = tournament.rounds.findIndex((round) => round.round === selectedRound.round);

      if (roundIndex !== -1) {
        const updatedRounds = [...tournament.rounds];
        updatedRounds[roundIndex] = {
          ...selectedRound
        };
        setTournament(
          {
            ...tournament,
            rounds: updatedRounds,
          }
        )

        updateSelectedTournament({
          ...tournament,
          rounds: updatedRounds,
        });
      }
    }

    if (rounds && rounds.length > 0) {
      // Utiliza flatMap para obtener todos los pairings de cada ronda en un solo arreglo
      const prevPairings = rounds.flatMap(round => round.pairings);

      // Establece prevPairings en el estado (usando setPreviousPairings)
      setPreviousPairings(prevPairings);
    }

  }, [pairings, winners]);

  useEffect(() => {
    if (selectedRound && selectedRound.playersRound && tournament && tournament.players) {
      setSelectedRound({
        ...selectedRound,
        winners: [],
        pairings: resetPairingPoints(pairings),
        playersRound: tournament.players.map(player => {
          return { ...player, points: 0 }
        })
      });

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

  return (
    <>
      {tournament && !tournament.finished ? <div className='startedTournamentContainer'>
        <div className='startedTournamentRoundsContainer'>
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
                        setSelectedRound(round);
                      }

                    }}
                  >{`Ronda ${index + 1}`}</p>
                </div>
              ))}
          </div>
          <button
            className={selectedRound && !selectedRound.finished ? 'buttonReemparejar' : 'd-none'}
            onClick={() => {
              const prevPairings = rounds
                .filter(round => round.round !== selectedRound.round)
                .flatMap(round => round.pairings);
              setTogglePairing(!togglePairing)
              setPairings([])
              setPairings(generarEmparejamientosSuizos(results, prevPairings))
              setWinners([])
            }}
            disabled={selectedRound && selectedRound.finished}
          >REEMPAREJAR</button>
        </div>
        <div className='startedTournamentPairing'>
          <div className='pairingContainer'>
            <ul>
              {pairings && pairings.map((pairing, index) => (
                <div key={index} className='pairingsDivLiContainer'><span>{index + 1}</span><li >
                  {pairing.firstPlayer && pairing.secondPlayer && (
                    <>
                      <span>{`${pairing.firstPlayer.name} ${pairing.firstPlayer.surname}`}</span>
                      <span>
                        {pairing.secondPlayer.name !== 'BYE' ? <><button
                          onClick={() => {
                            handleResult(index, 'firstPlayer')
                          }}
                          className={winners[index] === 'firstPlayer' ? "selectedWinner" : ""}
                          disabled={selectedRound.finished}
                        >
                          <FaChessPawn />
                        </button>
                          <button
                            onClick={() => handleResult(index, 'empate')}
                            className={`${winners[index] === 'empate' ? "selectedWinner" : ''} ${selectedRound.finished ? 'changeResultsButton' : ''}`}
                            disabled={selectedRound.finished}
                          >1/2</button>
                          <button
                            onClick={() => handleResult(index, 'secondPlayer')}
                            className={winners[index] === 'secondPlayer' ? "selectedWinner" : ""}
                            disabled={selectedRound.finished}
                          >
                            <FaChessPawn />
                          </button>
                        </> : <button onClick={() => handleResult(index, 'BYE')} disabled={selectedRound.finished} className={winners[index] === 'BYE' ? "selectedBye" : "byeButton"}>BYE</button>}
                      </span>
                      <span>{`${pairing.secondPlayer.name} ${pairing.secondPlayer.surname ? pairing.secondPlayer.surname : ''}`}</span>
                    </>
                  )}
                </li>
                </div>
              ))}
            </ul>
            {selectedRound && !selectedRound.finished && !selectedRound.isLast ? (<button
              className={!isNextRoundEnabled ? 'nextRoundDisabled' : 'nextRound'}
              onClick={() => {

                setSelectedRound({ ...selectedRound, pairings: pairings, winners: winners })

                const nextRound = rounds.find((round, index) => index === indexRound + 1);
                setRounds((prevRounds) =>
                  prevRounds.map((round, ind) => {
                    if (round.round === selectedRound.round) {
                      return { ...selectedRound, finished: true, winners: winners };
                    } else if (round === nextRound) {
                      return { ...nextRound, started: true }
                    } else {
                      return round
                    }
                  }
                  )
                );

                setPairings(generarEmparejamientosSuizos(results, previousPairings))
                setSelectedRound({ ...nextRound, started: true })
                updateSelectedTournament({ ...tournament, rounds: rounds })
                updateTournaments({ ...tournament, rounds: rounds })
              }}
              disabled={!isNextRoundEnabled}
            >
              SIGUIENTE RONDA
            </button>)
              : selectedRound && selectedRound.isLast && isNextRoundEnabled ?
                <Link
                  href="/torneos"
                  onClick={() => {
                    setTournament({ ...tournament, winner: results[0], finished: true, results: results });
                    updateSelectedTournament({ ...tournament, rounds: rounds });
                    updateTournaments({ ...tournament, rounds: rounds });
                  }}
                  className='nextRound'
                >
                  TERMINAR TORNEO
                </Link> : ''}
          </div>
        </div>
        <div className='startedTournamentResults'>
          <ul>
            <li>
              <span>Jugador</span>
              <span>Puntaje</span>
            </li>
            <div>
              {results && finalResults &&
                results
                  .slice()
                  .sort((a, b) => b.points - a.points)
                  .map((player, index) => (
                    <li key={index}>

                      <span><span>{index + 1}.  </span>        {`   ${player.name} ${player.surname}`}</span>
                      <span>{player.points}</span>
                    </li>
                  ))}
            </div>
          </ul>
        </div>
      </div> : ''}</>
  );
};

export default Start;
