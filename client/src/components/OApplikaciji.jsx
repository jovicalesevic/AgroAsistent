import { useState } from 'react'

export default function OApplikaciji() {
  const [otvoren, setOtvoren] = useState(false)

  if (!otvoren) return (
    <button
      type="button"
      onClick={() => setOtvoren(true)}
      className="flex items-center gap-2 rounded-xl bg-forest-600 px-4 py-2 text-sm font-semibold hover:bg-forest-500 transition"
    >
      <span>ℹ️</span>
      <span>O aplikaciji</span>
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-forest-900">🌾 O aplikaciji</h2>
          <button
            type="button"
            onClick={() => setOtvoren(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 text-forest-800 text-sm">
          <div>
            <h3 className="font-semibold text-forest-900 text-base mb-1">Šta je AgroAsistent?</h3>
            <p>AgroAsistent je besplatna veb aplikacija namenjena srpskim poljoprivrednicima. Pruža brz pristup vremenskim podacima, korisnim linkovima, beležnici radova i upravljanju parcelama — sve na jednom mestu.</p>
          </div>

          <div>
            <h3 className="font-semibold text-forest-900 text-base mb-2">Kako koristiti aplikaciju</h3>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="shrink-0">📍</span>
                <span><strong>Lokacija</strong> — izaberite opštinu u Navbaru. Svi lokalni resursi i vremenska prognoza prilagodiće se izabranoj lokaciji.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">🌤️</span>
                <span><strong>Vreme</strong> — kliknite na dugme "Vreme" za trenutne vremenske podatke za izabranu opštinu.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">📋</span>
                <span><strong>Beležnica</strong> — evidentišite dnevne aktivnosti na imanju. Potrebna je prijava.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">🌱</span>
                <span><strong>Parcele</strong> — uvezite parcele iz eAgrara kopiranjem tabele iz ePodsticaja. Potrebna je prijava.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">🧮</span>
                <span><strong>Kalkulator</strong> — unesite zapreminu prskalice i koncentraciju sredstva iz uputstva da biste izračunali potrebnu količinu.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">👤</span>
                <span><strong>Prijava</strong> — kliknite na dugme sa vašim imenom ili "Prijava" u Navbaru. Podržana je prijava putem Google naloga ili email adrese.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-forest-900 text-base mb-1">Instalacija na telefon</h3>
            <p>AgroAsistent možete instalirati kao aplikaciju na telefon. U Chrome browseru kliknite na tri tačke → "Dodaj na početni ekran". Na iPhone uređaju koristite Safari → Share → "Add to Home Screen".</p>
          </div>

          <div className="border-t border-forest-100 pt-4">
            <h3 className="font-semibold text-forest-900 text-base mb-1">Kontakt</h3>
            <p>Za pitanja, sugestije ili prijavu grešaka:</p>
            
            <a
              href="mailto:agroasistent.kontakt@gmail.com"
              className="text-forest-600 hover:underline font-medium"
            >
              agroasistent.kontakt@gmail.com
            </a>
            <p className="mt-3 text-xs text-gray-500">
              Sadržaj aplikacije je informativnog karaktera i koristite ga na sopstvenu odgovornost.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
