import { useState } from 'react'
import { useUser, useClerk, SignInButton } from '@clerk/clerk-react'
import { useLokacija } from '../context/LokacijaContext'
import VremePanel from './VremePanel'

export default function Navbar() {
  const { opstina, setOpstina, OPSTINE } = useLokacija()
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()

  const [showLokacija, setShowLokacija] = useState(false)
  const [showVreme, setShowVreme] = useState(false)
  const [showAuth, setShowAuth] = useState(false)


  return (
    <nav className="bg-forest-700 text-white shadow-md">
      {/* Prva linija */}
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-xl font-bold tracking-tight">Agro Asistent</span>
        </div>
      </div>

      {/* Druga linija — dugmad */}
      <div className="bg-forest-800 px-4 py-2">
        <div className="mx-auto max-w-4xl flex flex-wrap gap-2">

          {/* Dugme 1 — Lokacija */}
          <div className="relative">
            <button
              onClick={() => { setShowLokacija(!showLokacija); setShowVreme(false); setShowAuth(false) }}
              className="flex items-center gap-2 rounded-xl bg-forest-600 px-4 py-2 text-sm font-semibold hover:bg-forest-500 transition"
            >
              <span>📍</span>
              <span>{opstina ? opstina.naziv : 'Izaberi opštinu'}</span>
              <span className="text-xs">{showLokacija ? '▲' : '▼'}</span>
            </button>

            {showLokacija && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-white text-forest-900 rounded-xl shadow-lg border border-forest-200 w-56 max-h-72 overflow-y-auto">
                <div
                  className="px-4 py-2 text-sm hover:bg-forest-50 cursor-pointer border-b border-forest-100"
                  onClick={() => { setOpstina(null); setShowLokacija(false) }}
                >
                  Izaberi opštinu
                </div>
                {OPSTINE.map(o => (
  <div
    key={o.naziv}
    onClick={() => { setOpstina(o); setShowLokacija(false) }}
    className={`px-4 py-2 text-sm cursor-pointer hover:bg-forest-50 ${opstina?.naziv === o.naziv ? 'bg-forest-100 font-semibold' : ''}`}
  >
    {o.naziv}
  </div>
))}
              </div>
            )}
          </div>

          {/* Dugme 2 — Vreme */}
          <button
            onClick={() => { setShowVreme(!showVreme); setShowLokacija(false); setShowAuth(false) }}
            className="flex items-center gap-2 rounded-xl bg-forest-600 px-4 py-2 text-sm font-semibold hover:bg-forest-500 transition"
          >
            <span>🌤️</span>
            <span>Vreme</span>
            <span className="text-xs">{showVreme ? '▲' : '▼'}</span>
          </button>

          {/* Dugme 3 — Auth */}
          <button
            onClick={() => { setShowAuth(!showAuth); setShowLokacija(false); setShowVreme(false) }}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-400 transition ml-auto"
          >
            <span>👤</span>
            <span>{isSignedIn ? user.firstName || 'Nalog' : 'Prijava'}</span>
          </button>

        </div>

        {/* Vreme panel */}
        {showVreme && (
          <div className="mx-auto max-w-4xl mt-2 bg-white text-forest-900 rounded-xl shadow-lg border border-forest-200 p-4">
            <VremePanel />
          </div>
        )}

        {/* Auth panel */}
        {showAuth && (
          <div className="mx-auto max-w-4xl mt-2 bg-white text-forest-900 rounded-xl shadow-lg border border-forest-200 p-4">
            {isSignedIn ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm text-forest-600">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                >
                  Odjavi se
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-forest-700">Prijavite se da pristupite beležnici i parcelama</p>
                <SignInButton mode="modal">
                  <button className="w-full rounded-xl bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-600 transition">
                    Prijavi se / Registruj se
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
