"use client"

import React, { useState, useEffect, useRef } from 'react';

import Link from 'next/link'

import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import { createTournament, getTournaments, deleteTournament, addPlayer, deletePlayer, addExistingPlayer, getPlayersByTournament, getAllPlayers, updateTournamentByeValue, updateSelectedTournament, updateTournamentStarted, updateTournaments, updateAllTournaments } from '@/components/fileOperations';

import { BsTrash } from "react-icons/bs";

import { MdAddCircle } from "react-icons/md";

import { generarEmparejamientosSuizos } from '@/components/pairings'

import { ToastContainer } from "react-toastify";

import { CreateTournamentToast, DeleteTournamentToast, CreateTournamentErrorToast, AddPlayerToast, DeletePlayerToast, AddPlayerErrorToast, AddPlayerError2Toast, StartTournamentErrorToast } from '@/components/toasts'



const Torneos = () => {

  /* STATES */

  const [tournaments, setTournaments] = useState([]);

  const [players, setPlayers] = useState([])

  /* ------ */

  const [selectedAllPlayer, setSelectedAllPlayer] = useState({})

  const [selectedTournament, setSelectedTournament] = useState({})

  const [selectedPlayer, setSelectedPlayer] = useState({})

  /* ------ */

  const [inputTournament, setInputTournament] = useState('')

  const [inputPlayerName, setInputPlayerName] = useState('')

  const [inputPlayerSurname, setInputPlayerSurname] = useState('')

  const [rounds, setRounds] = useState(6)

  const [bye, setBye] = useState(1)

  /* ------ */

  const [toggle, setToggle] = useState(false)

  const [showTournaments, setShowTournaments] = useState(false)

  const [updatePlayers, setUpdatePlayers] = useState(false)

  /* FUNCTIONS */

  const addPlayerToList = (tournament, playerName, playerSurname) => {
    addPlayer(tournament, { name: playerName, surname: playerSurname });
    setTournaments(getTournaments());
    setPlayers(getPlayersByTournament(selectedTournament));
    setInputPlayerName('')
    setInputPlayerSurname('');
    setSelectedTournament({ ...selectedTournament, players: [...selectedTournament.players, { name: playerName, surname: playerSurname }] })
    updateSelectedTournament(selectedTournament);
  }

  const deletePlayerFromList = (player) => {
    // Eliminar el jugador de la lista en selectedTournament
    const updatedPlayers = selectedTournament.players.filter((p) => p.id !== player.id);

    // Actualizar selectedTournament con la nueva lista de jugadores
    setSelectedTournament({ ...selectedTournament, players: updatedPlayers });

    // Resto de tu lógica...
    deletePlayer(selectedTournament.name, player.id);
    setSelectedPlayer({});
    updateSelectedTournament({ ...selectedTournament, players: updatedPlayers });
  };


  const torneoVacio = () => {
    setSelectedTournament({});
    updateSelectedTournament({})
  }

  function roundsArray(cantidad) {
    const arrayRounds = Array.from({ length: cantidad }, (_, index) => {
      const isLast = index === cantidad - 1;

      return {
        round: Number(index + 1),
        playersRound: players,
        winners: [],
        pairings: index === 0 ? generarEmparejamientosSuizos(players, []) : [],
        started: index === 0,
        finished: false,
        isLast: isLast,
      };
    });

    return arrayRounds;
  }
  const clasesDelTorneo = (torneo) => {
    const claseSeleccionado = selectedTournament && selectedTournament.name === torneo.name
      ? 'selectedTournament'
      : '';

    const claseIniciado = torneo.started ? 'startedTournament' : '';

    const claseTerminado = torneo.finished ? 'finishedTournament' : '';

    const selectedStarted = torneo.started && !torneo.finished && selectedTournament && selectedTournament.name === torneo.name ? 'selectedStartedTournament' : '';

    const selectedFinished = torneo.finished && selectedTournament && selectedTournament.name === torneo.name ? 'selectedFinishedTournament' : '';

    return `baseClass ${claseSeleccionado} ${claseIniciado} ${claseTerminado} ${selectedStarted} ${selectedFinished}`;
  };

  // TABS ADD PLAYER

  const inputRefs = [useRef(), useRef(), useRef()];

  const manejarKeyDown = (event, inputIndex) => {
    const nextInputIndex = (inputIndex + 1) % 3;

    if (event.key === 'Tab') {
      event.preventDefault();
      if (nextInputIndex === 0) {
        inputRefs[0].current.focus();
      } else {
        inputRefs[nextInputIndex].current.focus();
      }
    } else if (inputIndex === 2 && event.key === 'Enter') {
      addPlayerToList(selectedTournament, inputPlayerName, inputPlayerSurname);
      inputRefs[nextInputIndex].current.focus();
      setInputPlayerName('')
      setInputPlayerSurname('')
    }
  };

  /* EFFECTS */

  useEffect(() => {
    setPlayers(getPlayersByTournament(selectedTournament));
    setBye(selectedTournament.byeValue)
  }, [selectedTournament, updatePlayers])

  useEffect(() => {
    updateSelectedTournament(selectedTournament);
  }, [selectedTournament, addPlayerToList, deletePlayerFromList, bye, rounds])

  useEffect(() => {
    torneoVacio()
  }, [showTournaments])

  useEffect(() => {
    setTournaments(getTournaments());
    updateSelectedTournament(selectedTournament);
  }, [toggle])

  useEffect(() => {
    updateTournamentByeValue(selectedTournament, bye)
  }, [bye, rounds])



  return (
    <div className='tournaments'>
      <div className='tournamentsContainer'>
        <div className='tournamentFlex'>
          <div className='createTournament'>
            <h4>Crear Torneo</h4>
            <input placeholder='Torneo Armoza' value={inputTournament} onChange={(e) => {
              setInputTournament(e.target.value)
            }} />
            <button onClick={() => {
              createTournament(inputTournament);
              setToggle(!toggle);
              setInputTournament('');
            }}>Crear</button>
          </div>
        </div>
        <div className='tournamentResults'>
          {tournaments.map((tournament, index) => {
            const tournamentClasses = clasesDelTorneo(tournament);
            return (
              <p key={index + 1} onClick={() => {
                setSelectedTournament(tournament)
                setSelectedAllPlayer({})
                setSelectedPlayer({})
                setSelectedTournament(tournament)
                setToggle(!toggle)
              }} className={tournamentClasses}>{tournament ? tournament.name : ''}<span className={selectedTournament.name !== tournament.name ? 'd-none deleteTournamentButton' : 'deleteTournamentButton'} onClick={() => {
                deleteTournament(selectedTournament)
                setToggle(!toggle);
                setSelectedAllPlayer({})
                setSelectedPlayer({})
                setShowTournaments(!showTournaments)
              }}><BsTrash className='trashIcon' /></span></p>
            )
          })}
        </div>
      </div>
      <div className={Object.keys(selectedTournament).length !== 0 ? 'playersContainer' : 'd-none'}>
        <div className='tournamentDetails' >
          <div className={selectedTournament.finished ? 'd-none' : 'addPlayerContainer'}>
            <h4>Agregar Jugador</h4>
            <div className='addPlayerDiv'>
              <input onChange={(e) => {
                setInputPlayerName(e.target.value)
              }}
                placeholder='Nombre' type='text' value={inputPlayerName}
                id="input1"
                ref={inputRefs[0]}
                onKeyDown={(event) => manejarKeyDown(event, 0)} />
              <input onChange={(e) => {
                setInputPlayerSurname(e.target.value)
              }}
                placeholder='Apellido' value={inputPlayerSurname} type='text'
                id="input2"
                ref={inputRefs[1]}
                onKeyDown={(event) => manejarKeyDown(event, 1)} />
            </div>
            <button onClick={() => {
              addPlayerToList(selectedTournament, inputPlayerName, inputPlayerSurname);
            }}
              id="input3"
              ref={inputRefs[2]}
              onKeyDown={(event) => manejarKeyDown(event, 2)}>Agregar</button>
          </div>
          <div className={selectedTournament.finished ? 'd-none' : 'tournamentDetailsInfo'}>
            <div>
              <div>
                <label>Rondas</label>
                <div>
                  <p className={selectedTournament.started ? 'tournamentRoundsStarted' : 'tournamentRounds'}
                  >{selectedTournament.started ? selectedTournament.rounds.length : rounds}</p>
                  <div className={selectedTournament.started ? 'd-none' : ''}>
                    <button onClick={() => {
                      if (rounds < 12) {
                        setRounds(rounds + 1)
                      }
                    }}>
                      <BsChevronUp />
                    </button>
                    <button onClick={() => {
                      if (rounds > 2) {
                        setRounds(rounds - 1)
                      }
                    }}>
                      <BsChevronDown />
                    </button>
                  </div>
                </div>
              </div>
              <div className={!selectedTournament.finished ? 'byeContainer' : 'd-none'}>
                <p>Editar valor del BYE</p>
                <label className='containerBye'>
                  0.5
                  <input
                    className='w-4 h-4 inputBye'
                    disabled={selectedTournament.started ? true : false}
                    type="radio"
                    name="byeOption"
                    value="0.5"
                    checked={bye === 0.5}
                    onChange={(e) => setBye(parseFloat(e.target.value))}
                  />
                  1
                  <input
                    className='w-4 h-4 inputBye'
                    disabled={selectedTournament.started ? true : false}
                    type="radio"
                    name="byeOption"
                    value="1"
                    checked={bye === 1}
                    onChange={(e) => setBye(parseFloat(e.target.value))}

                  />
                </label>
              </div>
            </div>
            {selectedTournament.started && !selectedTournament.finished && selectedTournament ?
              (<Link
                href={selectedTournament && `/torneos/${selectedTournament && selectedTournament.name ? selectedTournament.name.toLowerCase() : ''}`
                }
                className={'startTournament'}
                onClick={() => {
                  updateTournamentByeValue(selectedTournament, bye)
                  updateTournamentStarted(selectedTournament, true)
                  setTournaments(tournaments)
                  updateSelectedTournament({})
                  updateSelectedTournament({ ...selectedTournament, players: players })
                }}>
                IR A TORNEO
              </Link>)
              : selectedTournament.finished ? '' : selectedTournament.players && selectedTournament.players.length > 0 ? <Link
                href={selectedTournament &&
                  `/torneos/${selectedTournament && selectedTournament.name ? selectedTournament.name.toLowerCase() : ''}`
                }
                className={'startTournament'}
                onClick={() => {
                  if (selectedTournament && selectedTournament.players && selectedTournament.players.length === 0) {
                    return
                  }
                  setTournaments(tournaments)
                  setSelectedTournament({ ...selectedTournament, byeValue: bye, rounds: roundsArray(rounds), results: players.map(player => { return { ...player, points: 0 } }), players: players.map(player => { return { ...player, points: 0 } }) })
                  updateSelectedTournament({})
                  updateSelectedTournament(selectedTournament)
                  updateAllTournaments(tournaments)
                  updateTournaments({
                    ...selectedTournament, byeValue: bye, rounds: roundsArray(rounds), results: players.map(player => { return { ...player, points: 0 } }), players:
                      players.map(player => {
                        if (player.name !== 'BYE') {
                          return { ...player, points: 0 }
                        } else {
                          return {}
                        }
                      }), started: true
                  })
                }}>
                COMENZAR TORNEO
              </Link> : <></>}
          </div>
        </div>
        <div className='playersResultsContainer'>
          <div className='playersResults'>
            <h3>Jugadores del torneo:<span className='tournamentName'>&nbsp;{selectedTournament.name}</span><span>{selectedTournament && selectedTournament.players && selectedTournament.players.length}</span></h3>
            <div>
              {players && Object.keys(selectedTournament).length !== 0 ? players.filter(
                (player) => player.name !== 'BYE'
              ).map((player, index) => {
                return (
                  <p onClick={() => {
                    selectedTournament && !selectedTournament.finished ? setSelectedPlayer(player) : ''
                    setToggle(!toggle)
                    setSelectedAllPlayer({})
                  }} className={selectedPlayer.id == player.id ? 'selectedPlayer' : ''} key={index + 1}>{player.name && typeof player.name === 'string' ? `${player.name.charAt(0).toUpperCase()}${player.name.slice(1).toLowerCase()}` : ''}
                    {' '}
                    {player.surname && typeof player.surname === 'string' ? `${player.surname.charAt(0).toUpperCase()}${player.surname.slice(1).toLowerCase()}` : ''}<span className={selectedPlayer.id !== player.id || selectedTournament.finished ? 'd-none deleteTournamentButton' : 'deleteTournamentButton'} onClick={() => {
                      deletePlayerFromList(player)
                      setUpdatePlayers(!updatePlayers)
                    }}><BsTrash className='trashIcon' /></span></p>
                )
              }) : ''}
            </div>
          </div>
          <div className={selectedTournament.finished ? 'd-none playersResultsFastAdd' : 'playersResultsFastAdd'}>
            <h3>AGREGADO RAPIDO</h3>
            <div>
              {Object.keys(selectedTournament).length !== 0 ? getAllPlayers(players).filter(
                (player) => player.name !== 'BYE'
              ).map((player, index) => {
                return (
                  <p onClick={() => {
                    setSelectedAllPlayer(player);
                    setToggle(!toggle)
                    setSelectedPlayer({})
                  }} className={selectedAllPlayer.name == player.name && selectedAllPlayer.surname == player.surname ? 'selectedPlayer' : ''} key={index + 1}>{player.name ? `${player.name.charAt(0).toUpperCase()}${player.name.slice(1).toLowerCase()}` : ''}{' '}
                    {player.surname ? `${player.surname.charAt(0).toUpperCase()}${player.surname.slice(1).toLowerCase()}` : ''}
                    <span onClick={() => {
                      addExistingPlayer(selectedTournament, selectedAllPlayer)
                      setSelectedTournament({ ...selectedTournament, players: [...selectedTournament.players, player] })
                      setPlayers(getPlayersByTournament(selectedTournament))
                      AddPlayerToast()
                    }} className={selectedAllPlayer.name !== player.name || selectedAllPlayer.surname !== player.surname ? 'd-none addPlayerButton' : 'addPlayerButton'}><MdAddCircle className='addIcon' /></span></p>
                )
              }) : ''}
            </div>
          </div>
          <div className={selectedTournament.finished ? 'finalResultsContainer' : 'd-none'}>
            <div className='finalResults '>
              <p><span>Jugador</span><span>Puntos</span></p>
              <ul className='finalResultsScroll overflow-y-auto'>
                {selectedTournament.results &&
                  selectedTournament.results
                    .slice()
                    .sort((a, b) => b.points - a.points)
                    .map((player, index) => (
                      <li key={index}>
                        <span>{index + 1}.{`   ${player.name} ${player.surname}`}</span>
                        <span>{player.points}</span>
                      </li>
                    ))}
              </ul>

            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        limit={2}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default Torneos