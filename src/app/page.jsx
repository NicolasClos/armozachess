"use client"
import React from 'react'

import Link from 'next/link'

export default function Home() {
  
  return (
    <main>
      <div>
        <h1>CREA TU TORNEO SUIZO DE AJEDREZ</h1>
        <h3>¿ESTÁS LISTO?</h3>
        <Link className='mainEmpezar' href='/torneos'>EMPEZAR</Link>
      </div>
    </main>
  )
}
