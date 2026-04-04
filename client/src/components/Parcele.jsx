import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { apiUrl, getAuthHeaders } from '../api/client'

function ParcelaCard({ parcela: p, getHeaders, onRefresh }) {
  const [editMode, setEditMode] = useState(false)
  const [naziv, setNaziv] = useState(p.naziv_parcele || '')

  const sacuvajNaziv = async () => {
    try {
      const headers = await getHeaders()
      const res = await fetch(apiUrl(`/api/parcels/${p._id}`), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ naziv_parcele: naziv.trim() })
      })
      if (res.ok) {
        setEditMode(false)
        await onRefresh()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-forest-200 bg-forest-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-forest-900">{p.katastarska_opstina} - {p.broj_parcele}</div>
          {p.naziv_parcele && !editMode && (
            <div className="text-sm text-forest-700">{p.naziv_parcele}</div>
          )}
        </div>
        <span className="shrink-0 rounded-lg bg-forest-100 px-2 py-1 text-sm font-medium text-forest-800">
          {p.povrsina_ha} ha
        </span>
      </div>
      {p.kultura && <div className="text-sm text-forest-600">{p.kultura}</div>}
      {editMode ? (
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={naziv}
            onChange={e => setNaziv(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sacuvajNaziv()}
            className="flex-1 rounded-lg border border-forest-200 px-3 py-1.5 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
          />
          <button type="button" onClick={sacuvajNaziv}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
            Sacuvaj
          </button>
          <button type="button" onClick={() => setEditMode(false)}
            className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300">
            Otkazi
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setEditMode(true)}
          className="self-start rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700">
          Uredi naziv
        </button>
      )}
    </div>
  )
}

export default function Parcele() {
  const { getToken, isSignedIn } = useAuth()
  const [parcele, setParcele] = useState([])
  const [pasteText, setPasteText] = useState('')
  const [loading, setLoading] = useState(false)
  const [poruka, setPoruka] = useState(null)

  const getHeaders = () => getAuthHeaders(getToken)

  const ucitaj = async () => {
    setLoading(true)
    try {
      const headers = await getHeaders()
      const res = await fetch(apiUrl('/api/parcels'), { headers })
      if (res.ok) setParcele(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSignedIn) ucitaj()
  }, [isSignedIn])

  const parsirajParcele = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    const result = []
    for (const line of lines) {
      const cols = line.split('\t')
      if (cols.length < 4) continue
      const katastarska_opstina = (cols[0] || '').trim()
      const broj_parcele = (cols[1] || '').trim()
      const povrsina = parseFloat((cols[3] || '').replace(',', '.')) || 0
      const kultura = (cols[5] || '').trim()
      if (katastarska_opstina && broj_parcele) {
        result.push({
          katastarska_opstina,
          broj_parcele,
          povrsina_ha: povrsina,
          kultura,
          naziv_parcele: '',
          aktivna_obrada: true
        })
      }
    }
    return result
  }

  const uvezi = async () => {
    if (!pasteText.trim()) return
    const parsed = parsirajParcele(pasteText)
    if (parsed.length === 0) {
      setPoruka({ ok: false, text: 'Nije pronađena nijedna parcela. Proveri format tabele.' })
      return
    }
    setLoading(true)
    setPoruka(null)
    try {
      const headers = await getHeaders()
      const res = await fetch(apiUrl('/api/parcels/import'), {
        method: 'POST',
        headers,
        body: JSON.stringify(parsed)
      })
      if (res.ok) {
        const data = await res.json()
        setPoruka({ ok: true, text: `Uspešno uvezeno ${data.count} parcela.` })
        setPasteText('')
        await ucitaj()
      } else {
        let detail = 'Greška pri uvozu parcela.'
        try {
          const err = await res.json()
          if (err.error) detail = err.error
        } catch (_) { /* ignore */ }
        setPoruka({ ok: false, text: detail })
      }
    } catch (err) {
      console.error(err)
      setPoruka({ ok: false, text: 'Greška pri uvozu parcela.' })
    } finally {
      setLoading(false)
    }
  }

  const obrisiSve = async () => {
    if (!confirm('Da li želite da obrišete sve parcele?')) return
    try {
      const headers = await getHeaders()
      await fetch(apiUrl('/api/parcels'), { method: 'DELETE', headers })
      setParcele([])
      setPoruka({ ok: true, text: 'Sve parcele obrisane.' })
    } catch (err) {
      console.error(err)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-forest-200 bg-white p-6 shadow-sm text-center">
        <p className="text-forest-700">Prijavite se da pristupite parcelama.</p>
      </div>
    )
  }

  return (
    <section className="mx-auto mb-8 max-w-4xl">
      <h2 className="mb-4 text-2xl font-semibold text-forest-900">Moje Parcele</h2>
      <div className="rounded-2xl border border-forest-200 bg-white p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-medium text-forest-800">Nalepi tabelu iz eAgrara ovde</span>
        </div>
        <textarea
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          rows={6}
          placeholder="Nalepi tabelu iz eAgrara ovde..."
          className="w-full rounded-xl border border-forest-200 bg-white px-4 py-3 text-forest-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <div className="mt-3 flex gap-3">
          <button type="button" onClick={uvezi} disabled={loading}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50">
            {loading ? 'Uvoz...' : 'Uvezi parcele'}
          </button>
          {parcele.length > 0 && (
            <button type="button" onClick={obrisiSve}
              className="rounded-xl border border-red-300 bg-red-50 px-5 py-2.5 text-base font-medium text-red-700 transition hover:bg-red-100">
              Obriši sve
            </button>
          )}
        </div>
        {poruka && (
          <p className={`mt-3 text-sm font-medium ${poruka.ok ? 'text-green-600' : 'text-red-600'}`}>
            {poruka.text}
          </p>
        )}
        {loading && <p className="mt-4 text-sm text-forest-600">Učitavanje...</p>}
        {parcele.length > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            {parcele.map(p => (
              <ParcelaCard
                key={p._id}
                parcela={p}
                getHeaders={getHeaders}
                onRefresh={ucitaj}
              />
            ))}
          </div>
        )}
        {parcele.length === 0 && !loading && (
          <p className="mt-4 text-sm text-forest-600">Nema uvezenih parcela.</p>
        )}
        </div>
      </section>
    )
  }
