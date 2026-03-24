import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'

const API_BASE = ''

export default function Beleznica() {
  const { getToken, isSignedIn } = useAuth()
  const [beleske, setBeleske] = useState([])
  const [tekst, setTekst] = useState('')
  const [prikazano, setPrikazano] = useState(false)
  const [loading, setLoading] = useState(false)

  const getHeaders = async () => {
    const token = await getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const ucitaj = async () => {
    setLoading(true)
    try {
      const headers = await getHeaders()
      const res = await fetch(`${API_BASE}/api/beleske`, { headers })
      if (res.ok) setBeleske(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const sacuvaj = async () => {
    console.log('sacuvaj pozvano, tekst:', tekst)
    if (!tekst.trim()) return
    try {
      const headers = await getHeaders()
      const res = await fetch(`${API_BASE}/api/beleske`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: tekst.trim() })
      })
      if (res.ok) {
        setTekst('')
        await ucitaj()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggle = async (id) => {
    try {
      const headers = await getHeaders()
      await fetch(`${API_BASE}/api/beleske/${id}/toggle`, { method: 'PUT', headers })
      await ucitaj()
    } catch (err) {
      console.error(err)
    }
  }

  const obrisi = async (id) => {
    try {
      const headers = await getHeaders()
      await fetch(`${API_BASE}/api/beleske/${id}`, { method: 'DELETE', headers })
      await ucitaj()
    } catch (err) {
      console.error(err)
    }
  }

  const obrisiSve = async () => {
    if (!confirm('Da li želite da obrišete sve beleške?')) return
    try {
      const headers = await getHeaders()
      await fetch(`${API_BASE}/api/beleske`, { method: 'DELETE', headers })
      await ucitaj()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDatum = (iso) => {
    return new Date(iso).toLocaleString('sr-RS', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (!isSignedIn) {
    return (
      <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-forest-200 bg-white p-6 shadow-sm text-center">
        <p className="text-forest-700">Prijavite se da pristupite beležnici.</p>
      </div>
    )
  }

  return (
    <section className="mx-auto mb-8 max-w-4xl">
      <h2 className="mb-4 text-2xl font-semibold text-forest-900">📋 Beležnica</h2>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-forest-800">Šta ste danas radili?</label>
            <input
              type="text"
              value={tekst}
              onChange={e => setTekst(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sacuvaj()}
              placeholder="npr. Prskanje kukuruza, oranje parcela..."
              className="w-full rounded-xl border border-forest-200 bg-white px-4 py-2.5 text-forest-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <button type="button" onClick={sacuvaj}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-base font-semibold text-amber-950 shadow-sm transition hover:bg-amber-600">
            📝 Sačuvaj
          </button>
        </div>

        <button type="button"
          onClick={() => { setPrikazano(!prikazano); if (!prikazano) ucitaj() }}
          className="mt-4 rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-500">
          {prikazano ? 'Sakrij aktivnosti' : 'Vidi aktivnosti'}
        </button>

        {prikazano && (
          <div className="mt-4">
            {loading ? (
              <p className="text-sm text-forest-600">Učitavanje...</p>
            ) : (
              <>
                <ul className="flex flex-col gap-3">
                  {beleske.map(b => (
                    <li key={b._id}
                      className={`flex items-start justify-between gap-3 rounded-xl p-4 shadow-sm ${b.zavrseno ? 'bg-yellow-200' : 'bg-yellow-100'}`}
                      style={{borderLeft: '4px solid #f59e0b'}}>
                      <div className="flex flex-1 flex-col">
                        <span className={`text-forest-900 ${b.zavrseno ? 'line-through text-gray-500' : ''}`}>{b.text}</span>
                        <span className="mt-1 text-xs text-amber-800">{formatDatum(b.dateTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button type="button" onClick={() => toggle(b._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                          ✓
                        </button>
                        <button type="button" onClick={() => obrisi(b._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700 border border-red-300 hover:bg-red-200">
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                {beleske.length > 0 && (
                  <button type="button" onClick={obrisiSve}
                    className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
                    Obriši sve
                  </button>
                )}
                {beleske.length === 0 && (
                  <p className="text-sm text-forest-600">Nema sačuvanih aktivnosti.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
