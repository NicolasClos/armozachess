"use client"
import React, { useState, useEffect } from 'react';

import { FaChessPawn } from "react-icons/fa";

import {generarEmparejamientosSuizos} from './pairings'

const Matchmaking = ({ players }) => {

  const pairings = generarEmparejamientosSuizos(players, [])

  return (
    <div className='pairingContainer'>
      <h2>EMPAREJAMIENTO - RONDA </h2>
      <ul>
        {pairings && pairings.map((pairing, index) => (
          pairing.player1 && pairing.player2 ? (<li key={index}><span>
            {pairing.player1 && `${pairing.player1.name} ${pairing.player1.surname}`}</span> <span><button onClick={() => handleResult(index, 'player1')}><FaChessPawn /></button><button onClick={() => handleResult(index, 'empate')}>1/2</button><button onClick={() => handleResult(index, 'player2')}><FaChessPawn /></button></span><span> {pairing.player2 && `${pairing.player2.name} ${pairing.player2.surname}`}</span>
          </li>) : ''
        ))}
      </ul>
    </div>
  );
};

export default Matchmaking;