
export default function KorisniPortali() {
  return (
    <section className="mx-auto mb-8 max-w-4xl">
      <h2 className="mb-4 text-2xl font-semibold text-forest-900">Korisni portali</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <a href="https://a3.geosrbija.rs/katastar" target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center justify-center rounded-xl border border-forest-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-3xl">🗺️</span>
          <span className="mt-2 text-center text-sm font-semibold text-forest-900">Katastar (Geosrbija)</span>
        </a>
        <a href="https://www.agromarket.rs/" target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center justify-center rounded-xl border border-forest-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-3xl">🧴</span>
          <span className="mt-2 text-center text-sm font-semibold text-forest-900">Agromarket</span>
        </a>
        <a href="https://www.kupujemprodajem.com/poljoprivreda/kategorija/501/najnoviji" target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center justify-center rounded-xl border border-forest-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-3xl">🚜</span>
          <span className="mt-2 text-center text-sm font-semibold text-forest-900">KupujemProdajem</span>
        </a>
      </div>
    </section>
  )
}
