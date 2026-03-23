export default function EAgrar() {
  return (
    <section className="mx-auto mb-8 max-w-4xl">
      <h2 className="mb-4 text-2xl font-semibold text-forest-900">eAgrar, subvencije i stručne službe</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <a href="https://eagrar.gov.rs/" target="_blank" rel="noopener noreferrer"
          className="flex h-14 items-center justify-center rounded-2xl bg-yellow-500 px-2 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-600">
          eAgrar
        </a>
        <a href="https://epodsticaji.eagrar.gov.rs/" target="_blank" rel="noopener noreferrer"
          className="flex h-14 items-center justify-center rounded-2xl bg-yellow-500 px-2 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-600">
          ePodsticaji
        </a>
        <a href="https://uap.gov.rs/" target="_blank" rel="noopener noreferrer"
          className="flex h-14 items-center justify-center rounded-2xl bg-yellow-500 px-2 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-600">
          Aktuelni konkursi
        </a>
        <a href="https://www.psss.rs/" target="_blank" rel="noopener noreferrer"
          className="flex h-14 items-center justify-center rounded-2xl bg-yellow-500 px-2 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-600">
          Stručne službe
        </a>
      </div>
    </section>
  )
}
