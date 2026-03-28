import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function AdminPanel() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [oglasi, setOglasi] = useState([])
  const [forma, setForma] = useState({
    naslov: '',
    sadrzaj: '',
    tip: 'tekst',
    mediaUrl: '',
    link: '',
    vaziOd: '',
    vaziDo: '',
    aktivan: true
  })
  const [loading, setLoading] = useState(false)
  const [poruka, setPoruka] = useState('')

  const isAdmin = user?.publicMetadata?.role === 'admin'

  const getHeaders = async () => {
    const token = await getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const ucitajOglase = async () => {
    try {
      const headers = await getHeaders()
      const res = await fetch(`${API_BASE}/api/oglasi`, { headers })
      if (res.ok) setOglasi(await res.json())
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isAdmin) ucitajOglase()
  }, [isAdmin])

  const sacuvaj = async () => {
    setLoading(true)
    setPoruka('')
    try {
      const headers = await getHeaders()
      const res = await fetch(`${API_BASE}/api/oglasi`, {
        method: 'POST',
        headers,
        body: JSON.stringify(forma)
      })
      if (res.ok) {
        setPoruka('Oglas uspešno kreiran!')
        setForma({ naslov: '', sadrzaj: '', tip: 'tekst', mediaUrl: '', link: '', vaziOd: '', vaziDo: '', aktivan: true })
        await ucitajOglase()
      } else {
        setPoruka('Greška pri kreiranju oglasa.')
      }
    } catch (err) {
      console.error(err)
      setPoruka('Greška pri kreiranju oglasa.')
    } finally {
      setLoading(false)
    }
  }

  const toggle = async (id) => {
    try {
      const headers = await getHeaders()
      await fetch(`${API_BASE}/api/oglasi/${id}/toggle`, { method: 'PUT', headers })
      await ucitajOglase()
    } catch (err) {
      console.error(err)
    }
  }

  const obrisi = async (id) => {
    if (!confirm('Da li želite da obrišete oglas?')) return
    try {
      const headers = await getHeaders()
      await fetch(`${API_BASE}/api/oglasi/${id}`, { method: 'DELETE', headers })
      await ucitajOglase()
    } catch (err) {
      console.error(err)
    }
  }

  if (!isAdmin) return null

  return (
    <section className="mx-auto mb-8 max-w-4xl">
      <h2 className="mb-4 text-2xl font-semibold text-forest-900">🛠️ Admin panel — Oglasi</h2>

      <div className="rounded-2xl border-2 border-forest-200 bg-white p-6 shadow-md mb-6">
        <h3 className="text-lg font-semibold text-forest-900 mb-4">Novi oglas</h3>
        <div className="flex flex-col gap-3">
          <input type="text" placeholder="Naslov (opciono)"
            value={forma.naslov} onChange={e => setForma({...forma, naslov: e.target.value})}
            className="w-full rounded-xl border border-forest-200 px-4 py-2 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-300" />
          <textarea placeholder="Sadržaj oglasa" rows={3}
            value={forma.sadrzaj} onChange={e => setForma({...forma, sadrzaj: e.target.value})}
            className="w-full rounded-xl border border-forest-200 px-4 py-2 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-300" />
          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-forest-700">Tip oglasa</label>
              <select value={forma.tip} onChange={e => setForma({...forma, tip: e.target.value})}
                className="rounded-xl border border-forest-200 px-3 py-2 text-forest-900 focus:outline-none">
                <option value="tekst">Tekst</option>
                <option value="slika">Slika</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-forest-700">Media URL (za sliku/video)</label>
              <input type="text" placeholder="https://..."
                value={forma.mediaUrl} onChange={e => setForma({...forma, mediaUrl: e.target.value})}
                className="rounded-xl border border-forest-200 px-3 py-2 text-forest-900 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-forest-700">Link (opciono)</label>
              <input type="text" placeholder="https://..."
                value={forma.link} onChange={e => setForma({...forma, link: e.target.value})}
                className="rounded-xl border border-forest-200 px-3 py-2 text-forest-900 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-forest-700">Važi od</label>
              <input type="datetime-local"
                value={forma.vaziOd} onChange={e => setForma({...forma, vaziOd: e.target.value})}
                className="rounded-xl border border-forest-200 px-3 py-2 text-forest-900 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-forest-700">Važi do</label>
              <input type="datetime-local"
                value={forma.vaziDo} onChange={e => setForma({...forma, vaziDo: e.target.value})}
                className="rounded-xl border border-forest-200 px-3 py-2 text-forest-900 focus:outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="aktivan" checked={forma.aktivan}
              onChange={e => setForma({...forma, aktivan: e.target.checked})}
              className="w-4 h-4" />
            <label htmlFor="aktivan" className="text-sm text-forest-800">Aktivan odmah</label>
          </div>
          <button type="button" onClick={sacuvaj} disabled={loading}
            className="self-start rounded-xl bg-forest-700 px-5 py-2.5 text-base font-semibold text-white hover:bg-forest-800 transition disabled:opacity-50">
            {loading ? 'Čuvanje...' : 'Kreiraj oglas'}
          </button>
          {poruka && (
            <p className={`text-sm font-medium ${poruka.includes('spešno') ? 'text-green-600' : 'text-red-600'}`}>
              {poruka}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-forest-900">Postojeći oglasi</h3>
        {oglasi.length === 0 && <p className="text-sm text-forest-600">Nema oglasa.</p>}
        {oglasi.map(o => (
          <div key={o._id} className={`rounded-xl border p-4 shadow-sm ${o.aktivan ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {o.naslov && <p className="font-semibold text-forest-900">{o.naslov}</p>}
                {o.sadrzaj && <p className="text-sm text-forest-700 mt-1">{o.sadrzaj}</p>}
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-forest-600">
                  <span className="rounded bg-forest-100 px-2 py-0.5">{o.tip}</span>
                  {o.link && <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700">{o.link}</span>}
                  <span className={`rounded px-2 py-0.5 ${o.aktivan ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {o.aktivan ? 'Aktivan' : 'Neaktivan'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => toggle(o._id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition ${o.aktivan ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}>
                  {o.aktivan ? 'Deaktiviraj' : 'Aktiviraj'}
                </button>
                <button type="button" onClick={() => obrisi(o._id)}
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition">
                  Obriši
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
