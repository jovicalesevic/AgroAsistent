
import { useState } from 'react'

const PROIZVODJACI = [
  {
    naziv: "Galenika Fitofarmacija",
    url: "https://www.fitofarmacija.rs/",
    opis: "Fitofarmaceutski preparati i zastita bilja"
  }
]

export default function Kalkulator() {
  const [litraza, setLitraza] = useState(10)
  const [procenat, setProcenat] = useState('')
  const [rezultat, setRezultat] = useState(null)
  const [showProizvodjaci, setShowProizvodjaci] = useState(false)

  const izracunaj = () => {
    const l = parseFloat(litraza)
    const p = parseFloat(procenat)
    if (!l || !p || l <= 0 || p <= 0) {
      setRezultat({ greska: "Unesite validne vrednosti." })
      return
    }
    const ml = (l * p) / 100 * 1000
    const litra = ml / 1000
    setRezultat({ ml: ml.toFixed(1), litra: litra.toFixed(3) })
  }

  const reset = () => {
    setLitraza(10)
    setProcenat('')
    setRezultat(null)
  }

  return (
    <section className="mx-auto mb-8 max-w-4xl">
      <h2 className="mb-4 text-2xl font-semibold text-forest-900">Kalkulator</h2>

      <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-6 shadow-md mb-4">
        <h3 className="mb-4 text-lg font-semibold text-forest-900">Kalkulator za primenu hemijskih sredstava</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-forest-800">Velicina prskalice (L):</label>
            <div className="mb-1 flex flex-wrap gap-2">
              {[10, 12, 16].map(l => (
                <button key={l} type="button" onClick={() => setLitraza(l)}
                  className={`rounded-xl px-4 py-1.5 text-sm font-medium text-white transition ${litraza === l ? 'bg-sky-700' : 'bg-sky-500 hover:bg-sky-600'}`}>
                  {l}L
                </button>
              ))}
            </div>
            <input type="number" inputMode="decimal" min="1" step="any"
              value={litraza} onChange={e => setLitraza(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-forest-200 bg-white px-3 py-2 text-forest-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-forest-800">Koncentracija iz uputstva (%):</label>
            <input type="number" inputMode="decimal" min="0" step="any"
              value={procenat} onChange={e => setProcenat(e.target.value)}
              placeholder="npr. 0.5"
              className="w-full max-w-xs rounded-xl border border-forest-200 bg-white px-3 py-2 text-forest-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200" />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={izracunaj}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm transition hover:bg-sky-700">
              Izracunaj
            </button>
            <button type="button" onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-500 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-gray-600">
              Reset
            </button>
          </div>
        </div>

        {rezultat && (
          <div className={`mt-4 rounded-xl p-4 ${rezultat.greska ? 'bg-red-50 border-2 border-red-300 text-red-700' : 'bg-green-50 border-2 border-green-400 text-forest-900'}`}>
            {rezultat.greska ? (
              <p className="font-medium">{rezultat.greska}</p>
            ) : (
              <div>
                <p className="text-lg font-bold">Potrebna kolicina sredstva:</p>
                <p className="text-2xl font-extrabold text-sky-700 mt-1">{rezultat.ml} ml</p>
                <p className="text-lg font-semibold text-sky-600">{rezultat.litra} L</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border-2 border-forest-200 bg-white p-6 shadow-md">
        <button type="button" onClick={() => setShowProizvodjaci(!showProizvodjaci)}
          className="inline-flex items-center gap-2 rounded-xl bg-forest-700 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-forest-800">
          Proizvodjaci sredstava za negu bilja
          <span className="text-sm">{showProizvodjaci ? '▲' : '▼'}</span>
        </button>

        {showProizvodjaci && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PROIZVODJACI.map(p => (
              <a key={p.naziv} href={p.url} target="_blank" rel="noopener noreferrer"
                className="flex flex-col rounded-xl border border-forest-200 bg-forest-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <span className="font-semibold text-forest-900">{p.naziv}</span>
                <span className="mt-1 text-sm text-forest-600">{p.opis}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}


