"use client"

import React, { useState, useEffect } from 'react';

import Link from 'next/link'

import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import { createTournament, getTournaments, deleteTournament, addPlayer, deletePlayer, addExistingPlayer, getPlayersByTournament, getAllPlayers, updateTournamentByeValue, updateSelectedTournament, updateTournamentRounds, updateTournamentStarted, getSelectedTournament } from '@/components/fileOperations';

import { BsTrash } from "react-icons/bs";

import { MdAddCircle } from "react-icons/md";

const Torneos = () => {

  /* STATES */

  const [tournaments, setTournaments] = useState([]);

  const [players, setPlayers] = useState([])

  const [tournament, setTournament] = useState({})

  /* ------ */

  const [selectedAllPlayer, setSelectedAllPlayer] = useState({})

  const [selectedTournament, setSelectedTournament] = useState({})

  const [selectedPlayer, setSelectedPlayer] = useState({})

  /* ------ */

  const [inputTournament, setInputTournament] = useState('')

  const [inputPlayerName, setInputPlayerName] = useState('')

  const [inputPlayerSurname, setInputPlayerSurname] = useState('')

  const [rounds, setRounds] = useState(6)

  const [bye, setBye] = useState(0.5)

  /* ------ */

  const [toggle, setToggle] = useState(false)

  const [showTournaments, setShowTournaments] = useState(false)

  const [updatePlayers, setUpdatePlayers] = useState(false)

  const [showP, setShowP] = useState(false)

  /* FUNCTIONS */

  const addPlayerToList = (tournament, playerName, playerSurname) => {
    addPlayer(tournament, { name: playerName, surname: playerSurname });
    setTournaments(getTournaments());
    setPlayers(getPlayersByTournament(selectedTournament));
    setShowP(true)
    setTimeout(() => {
      setShowP(false);
      setInputPlayerName('')
      setInputPlayerSurname('');
    }, 1500)
  }

  const deletePlayerFromList = (player) => {
    deletePlayer(selectedTournament.name, player.id)
    setSelectedPlayer({})
    updateSelectedTournament(selectedTournament);
  }

  const torneoVacio = () => {
    setSelectedTournament({});
    updateSelectedTournament({})
  }

  function roundsArray(cantidad) {

    const arrayRounds =  Array.from({ length: cantidad }, (_, index) => ({
      round: Number(index + 1),
      playersRound: players,
      pairings: []
    }));

    return arrayRounds

  }

  const clasesDelTorneo = (torneo) => {
    const claseSeleccionado = selectedTournament && selectedTournament.name === torneo.name
      ? 'selectedTournament'
      : '';

    const claseIniciado = torneo.started ? 'startedTournament' : '';

    const claseTerminado = torneo.finished ? 'finishedTournament' : '';

    return `baseClass ${claseSeleccionado} ${claseIniciado} ${claseTerminado}`;
  };

  const errorCreatePlayer = () => {
    const existingPlayer = selectedTournament.players && selectedTournament.players.find(
      (existingPlayer) =>
        existingPlayer &&
        existingPlayer.name &&
        existingPlayer.surname &&
        existingPlayer.name.toLowerCase() === inputPlayerName.toLowerCase() &&
        existingPlayer.surname.toLowerCase() === inputPlayerSurname.toLowerCase()
    );

    const inputPlayer = existingPlayer || inputPlayerName === '' || inputPlayerSurname === '' ? <p color='colorRed'>O el jugador ya se encuentra en el torneo o no está completando nombre y apellido.</p> : <p className='colorGreen'>Creado correctamente</p>;

    return inputPlayer;
  };

  /* EFFECTS */

  useEffect(() => {
    setPlayers(getPlayersByTournament(selectedTournament));
    setTournaments(getTournaments());
    setTournament(getSelectedTournament())
  }, [])

  useEffect(() => {
    setPlayers(getPlayersByTournament(selectedTournament));
    setRounds(selectedTournament.rounds)
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
    updateTournamentRounds(selectedTournament, rounds)
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
        <div className='addPlayer' >
          <div className={selectedTournament.started ? 'd-none' : 'addPlayerContainer'}>
            <h4>Agregar Jugador</h4>
            <div className='addPlayerDiv'>
              <div>
                <input onChange={(e) => {
                  setInputPlayerName(e.target.value)
                }}
                  placeholder='Nombre' type='text' value={inputPlayerName} />
                <input onChange={(e) => {
                  setInputPlayerSurname(e.target.value)
                }}
                  placeholder='Apellido' value={inputPlayerSurname} type='text' />
              </div>
              <button onClick={() => {
                addPlayerToList(selectedTournament, inputPlayerName, inputPlayerSurname);
              }}>Agregar</button>
            </div>
          </div>
          <div className={showP ? 'colorRed' : 'd-none'}>
            {errorCreatePlayer()}
          </div>
          <div className='tournamentDetails'>
            <div>
              <div>
                <label>Rondas</label>
                <div>
                  
                  <input disabled={selectedTournament.started ? true : false} type="number" className='tournamentRounds' min={2} max={12} readOnly value={rounds}
                  />
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
              <div className={!selectedTournament.started ? 'byeContainer' : 'd-none'}>
                <p>Editar valor del BYE</p>
                <label className='containerBye'>
                  0.5
                  <input
                    className='w-5 h-5 inputBye'
                    disabled={selectedTournament.started ? true : false}
                    type="radio"
                    name="byeOption"
                    value="0.5"
                    checked={bye === 0.5}
                    onChange={(e) => setBye(parseFloat(e.target.value))}
                  />
                  1
                  <input
                    className='inputBye'
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
            {selectedTournament.started ?
              <Link
                href={selectedTournament && `/torneos/${selectedTournament && selectedTournament.name ? selectedTournament.name.toLowerCase() : ''}`
                }
                className={'startTournament'}
                onClick={() => {
                  updateTournamentRounds(selectedTournament, rounds)
                  updateTournamentByeValue(selectedTournament, bye)
                  updateTournamentStarted(selectedTournament, true)
                  setTournaments(tournaments)
                  updateSelectedTournament({})
                  updateSelectedTournament(selectedTournament)
                }}>
                IR A TORNEO
              </Link>
              : <Link
                href={selectedTournament &&
                  `/torneos/${selectedTournament && selectedTournament.name ? selectedTournament.name.toLowerCase() : ''}`
                }
                className={'startTournament'}
                onClick={() => {
                  updateTournamentRounds(selectedTournament, rounds)
                  updateTournamentByeValue(selectedTournament, bye)
                  updateTournamentStarted(selectedTournament, true)
                  setTournaments(tournaments)
                  if(selectedTournament.started){
                    setSelectedTournament({ ...selectedTournament,results: [players, [...players, { name: "NICOLASTU" }]], players: players })
                  } else{
                    setSelectedTournament({ ...selectedTournament, byeValue: bye, rounds: roundsArray(rounds),results: [players, [...players, { name: "NICOLASTU" }]], players: players })
                  }
                  updateSelectedTournament({})
                  updateSelectedTournament(selectedTournament)
                }}>
                COMENZAR TORNEO
              </Link>}
          </div>
        </div>
        <div className='playersResultsContainer'>
          <div className='playersResults'>
            <h3>Jugadores del torneo:<span className='tournamentName'>&nbsp;{selectedTournament.name}</span></h3>
            <div>
              {players && Object.keys(selectedTournament).length !== 0 ? players.map((player, index) => {
                return (
                  <p onClick={() => {
                    setSelectedPlayer(player);
                    setToggle(!toggle)
                    setSelectedAllPlayer({})
                  }} className={selectedPlayer.id == player.id ? 'selectedPlayer' : ''} key={index + 1}>{player.name && typeof player.name === 'string' ? `${player.name.charAt(0).toUpperCase()}${player.name.slice(1).toLowerCase()}` : ''}
                    {' '}
                    {player.surname && typeof player.surname === 'string' ? `${player.surname.charAt(0).toUpperCase()}${player.surname.slice(1).toLowerCase()}` : ''}<span className={selectedPlayer.id !== player.id || selectedTournament.started ? 'd-none deleteTournamentButton' : 'deleteTournamentButton'} onClick={() => {
                      deletePlayerFromList(player)
                      setUpdatePlayers(!updatePlayers)
                    }}><BsTrash className='trashIcon' /></span></p>
                )
              }) : ''}
            </div>
          </div>
          <div className={selectedTournament.started ? 'd-none playersResults' : 'playersResults'}>
            <h3>AGREGADO RAPIDO</h3>
            <div>
              {Object.keys(selectedTournament).length !== 0 ? getAllPlayers(players).map((player, index) => {
                return (
                  <p onClick={() => {
                    setSelectedAllPlayer(player);
                    setToggle(!toggle)
                    setSelectedPlayer({})
                  }} className={selectedAllPlayer.name == player.name && selectedAllPlayer.surname == player.surname ? 'selectedPlayer' : ''} key={index + 1}>{player.name ? `${player.name.charAt(0).toUpperCase()}${player.name.slice(1).toLowerCase()}` : ''}{' '}
                    {player.surname ? `${player.surname.charAt(0).toUpperCase()}${player.surname.slice(1).toLowerCase()}` : ''}
                    <span onClick={() => {
                      addExistingPlayer(selectedTournament, selectedAllPlayer)
                      setPlayers(getPlayersByTournament(selectedTournament))
                    }} className={selectedAllPlayer.name !== player.name || selectedAllPlayer.surname !== player.surname ? 'd-none addPlayerButton' : 'addPlayerButton'}><MdAddCircle className='addIcon' /></span></p>
                )
              }) : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Torneos