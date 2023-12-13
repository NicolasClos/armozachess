"use client"

import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link href='/'>Inicio</Link></li>
          <li><Link href='/torneos'>Torneos</Link></li>
        </ul>
      </nav>
    </header>
  )
}
