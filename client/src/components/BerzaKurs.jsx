import { useEffect, useState } from 'react'

export default function BerzaKurs() {
  const [kurs, setKurs] = useState(null)

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/EUR')
      .then(r => r.json())
      .then(data => {
        const rsd = data?.rates?.RSD
        if (typeof rsd === 'number') {
          setKurs(rsd.toFixed(2))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="mx-auto mb-8 max-w-4xl">
      <h2 className="mb-4 text-2xl font-semibold text-forest-900">Tržište i finansije</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <a href="https://www.stips.minpolj.gov.rs/" target="_blank" rel="noopener noreferrer"
          className="group rounded-2xl border border-forest-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div class="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700 text-2xl text-white shrink-0">📈</div>
            <div>
              <h3 className="text-lg font-semibold text-forest-900">Berzanske cene</h3>
              <p className="mt-1 text-sm text-forest-700">Pregled cena na pijacama i tržištima (STIPS).</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-forest-800">Pogledaj cene →</span>
            </div>
          </div>
        </a>

        <a href="https://www.nbs.rs/sr_RS/indeks/" target="_blank" rel="noopener noreferrer"
          className="group rounded-2xl border border-forest-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700 text-2xl text-white shrink-0">💴</div>
            <div>
              <h3 className="text-lg font-semibold text-forest-900">Kursna lista NBS</h3>
              <p className="mt-1 text-sm text-forest-700">Zvanični srednji kurs EUR.</p>
              {kurs && <p className="mt-2 text-xl font-bold text-forest-800">1 EUR = {kurs} RSD</p>}
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-forest-800">Otvori na NBS →</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  )
}
