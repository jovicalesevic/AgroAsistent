export default function Agroinfo() {
  return (
    <section className="mx-auto mb-8 max-w-4xl">
      <h2 className="mb-4 text-2xl font-semibold text-forest-900">Agroinfo</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <a href="https://agrotv.net/" target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center justify-center rounded-xl border border-forest-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-3xl">📺</span>
          <span className="mt-2 text-center text-sm font-semibold text-forest-900">AgroTV</span>
        </a>
        <a href="https://www.agroklub.rs/" target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center justify-center rounded-xl border border-forest-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-3xl">🌾</span>
          <span className="mt-2 text-center text-sm font-semibold text-forest-900">Agroklub</span>
        </a>
        <a href="https://www.poljoprivrednik.net/" target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center justify-center rounded-xl border border-forest-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-3xl">🚜</span>
          <span className="mt-2 text-center text-sm font-semibold text-forest-900">Poljoprivrednik</span>
        </a>
        <a href="http://www.agropress.org.rs/" target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center justify-center rounded-xl border border-forest-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-3xl">📰</span>
          <span className="mt-2 text-center text-sm font-semibold text-forest-900">Agropress</span>
        </a>
      </div>
    </section>
  )
}
