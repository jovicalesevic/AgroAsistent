import { useEffect, useState } from 'react'
import { useLokacija } from '../context/LokacijaContext'

async function fetchVreme(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&hourly=precipitation_probability&daily=sunrise,sunset&timezone=Europe%2FBelgrade`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Vremenski servis nije dostupan.')
  return res.json()
}

const formatVreme = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })
}

export default function VremePanel() {
  const { opstina } = useLokacija()
  const [vreme, setVreme] = useState(null)
  const [loading, setLoading] = useState(false)
  const [greska, setGreska] = useState('')

  useEffect(() => {
    if (!opstina) return
    setLoading(true)
    setGreska('')
    setVreme(null)

    fetchVreme(opstina.lat, opstina.lon)
      .then(data => {
        const c = data.current
        const now = new Date()
        const times = data.hourly?.time || []
        let idx = times.findIndex(t => new Date(t) > now)
        if (idx < 0) idx = 0
        const nextFew = data.hourly?.precipitation_probability?.slice(idx, idx + 4) || []
        const precipProb = nextFew.length ? Math.max(...nextFew) : null

        setVreme({
          temp: Math.round(c.temperature_2m),
          vlaznost: Math.round(c.relative_humidity_2m),
          vetar: Math.round(c.wind_speed_10m),
          padavine: Number(c.precipitation).toFixed(1),
          precipProb,
          sunrise: formatVreme(data.daily?.sunrise?.[0]),
          sunset: formatVreme(data.daily?.sunset?.[0]),
          mraz: Math.round(c.temperature_2m) < 3
        })
      })
      .catch((err) => {
        console.error('Greška:', err)
        setGreska('Nije moguće učitati podatke.')
      })
      .finally(() => setLoading(false))
  }, [opstina])

  if (!opstina) {
    return (
      <p className="text-sm text-forest-600 py-2">
        Prvo izaberi opštinu da bi video vremenske podatke.
      </p>
    )
  }

  if (loading) return <p className="text-sm text-forest-600 py-2">Učitavanje...</p>
  if (greska) return <p className="text-sm text-red-600 py-2">{greska}</p>
  if (!vreme) return null

  return (
    <div className="py-2">
      <p className="font-semibold text-forest-900 mb-3">📍 {opstina.naziv}</p>
      {vreme.mraz && (
        <p className="mb-2 text-sm font-semibold text-red-600">⚠️ Moguć mraz!</p>
      )}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-forest-800">
        <div>🌡️ Temperatura: <strong>{vreme.temp}°C</strong></div>
        <div>💧 Vlažnost: <strong>{vreme.vlaznost}%</strong></div>
        <div>🌬️ Vetar: <strong>{vreme.vetar} km/h</strong></div>
        <div>💦 Padavine: <strong>{vreme.padavine} mm</strong></div>
        {vreme.precipProb !== null && (
          <div>🌧️ Verovatnoća: <strong>{vreme.precipProb}%</strong></div>
        )}
        <div>🌅 Izlazak: <strong>{vreme.sunrise}</strong></div>
        <div>🌇 Zalazak: <strong>{vreme.sunset}</strong></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href="https://www.hidmet.gov.rs/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition"
        >
          RHMZ Srbije
        </a>
        <a
          href={`https://www.yr.no/en/search?q=${encodeURIComponent(opstina.naziv)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
        >
          Yr.no prognoza
        </a>
      </div>
    </div>
  )
}