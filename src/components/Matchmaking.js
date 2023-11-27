"use client"
import React, { useState, useEffect } from 'react';

import { FaChessPawn } from "react-icons/fa";

import { generarEmparejamientosSuizos } from './pairings'

const Matchmaking = ({ players, prevPairings }) => {

  const [pairings, setPairings] = useState([])

  useEffect(() => {
    setPairings(generarEmparejamientosSuizos(players, prevPairings))
  }, [players, prevPairings])

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
                  <button onClick={() => handleResult(index, 'firstPlayer')}><FaChessPawn /></button>
                  <button onClick={() => handleResult(index, 'empate')}>1/2</button>
                  <button onClick={() => handleResult(index, 'secondPlayer')}><FaChessPawn /></button>
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