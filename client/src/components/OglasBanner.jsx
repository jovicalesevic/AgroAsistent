import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function OglasBanner() {
  const [oglas, setOglas] = useState(null)
  const [zatvoren, setZatvoren] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/oglasi/aktivni`)
      .then(r => r.json())
      .then(data => {
        if (data) setOglas(data)
      })
      .catch(() => {})

    const interval = setInterval(() => {
      fetch(`${API_BASE}/api/oglasi/aktivni`)
        .then(r => r.json())
        .then(data => {
          if (data) {
            setOglas(data)
            setZatvoren(false)
          }
        })
        .catch(() => {})
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!oglas || zatvoren) return null

  return (
    <div className="fixed bottom-0 left-0 w-full bg-yellow-50 border-t-2 border-yellow-300 shadow-lg z-50">
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1">
          {oglas.tip === 'tekst' && (
            <p className="text-sm text-gray-700 italic">{oglas.sadrzaj}</p>
          )}
          {oglas.tip === 'slika' && oglas.mediaUrl && (
  <img src={oglas.mediaUrl} alt={oglas.naslov || 'Oglas'} className="h-24 object-contain" />
)}
{oglas.tip === 'video' && oglas.mediaUrl && (
  <video src={oglas.mediaUrl} autoPlay muted loop className="h-24" />
)}
          {oglas.naslov && (
            <p className="text-xs font-semibold text-gray-600 mt-1">{oglas.naslov}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {oglas.link && (
            <a
              href={oglas.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-forest-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-forest-800 transition"
            >
              Saznaj više
            </a>
          )}
          <button
            type="button"
            onClick={() => setZatvoren(true)}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
