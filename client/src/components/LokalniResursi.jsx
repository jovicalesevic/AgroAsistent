import { useLokacija } from '../context/LokacijaContext'

export default function LokalniResursi() {
  const { opstina } = useLokacija()
  const lokacija = opstina ? opstina.naziv : 'Srbija'

  const buildMapsUrl = (searchTerm) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTerm + ' ' + lokacija)}`
  }

  return (
    <section className="mx-auto mb-8 max-w-4xl">
      <h2 className="mb-4 text-2xl font-semibold text-forest-900">Lokalni resursi</h2>
      {!opstina && (
        <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          Izaberi opštinu u meniju za precizniju pretragu.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-forest-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-2xl text-white mb-3">✚</div>
          <h3 className="text-lg font-semibold text-forest-900">Poljoprivredne apoteke</h3>
          <p className="mt-1 text-sm text-forest-700">Pretraga najbliže apoteke u okolini.</p>
          <button type="button" onClick={() => window.open(buildMapsUrl('poljoprivredna apoteka'), '_blank', 'noopener,noreferrer')}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Pronađi apoteku
          </button>
        </div>

        <div className="rounded-2xl border border-forest-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-2xl text-white mb-3">🐾</div>
          <h3 className="text-lg font-semibold text-forest-900">Veterinarske stanice</h3>
          <p className="mt-1 text-sm text-forest-700">Pretraga najbližeg veterinara u okolini.</p>
          <button type="button" onClick={() => window.open(buildMapsUrl('veterinar'), '_blank', 'noopener,noreferrer')}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Pronađi veterinara
          </button>
        </div>

        <div className="rounded-2xl border border-forest-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-2xl text-white mb-3">🛒</div>
          <h3 className="text-lg font-semibold text-forest-900">Pijace</h3>
          <p className="mt-1 text-sm text-forest-700">Pretraga pijaca u okolini.</p>
          <button type="button" onClick={() => window.open(buildMapsUrl('pijaca'), '_blank', 'noopener,noreferrer')}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Pronađi pijacu
          </button>
        </div>
      </div>
    </section>
  )
}
