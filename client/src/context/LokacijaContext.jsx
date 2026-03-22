import { createContext, useContext, useState, useEffect } from 'react'

const OPSTINE = [
  { naziv: "Aleksinac", lat: 43.5439, lon: 21.7058 },
  { naziv: "Aranđelovac", lat: 44.3039, lon: 20.5594 },
  { naziv: "Beograd", lat: 44.8176, lon: 20.4569 },
  { naziv: "Bor", lat: 44.0742, lon: 22.0996 },
  { naziv: "Brus", lat: 43.3833, lon: 21.0333 },
  { naziv: "Čačak", lat: 43.8914, lon: 20.3497 },
  { naziv: "Čuprija", lat: 43.9281, lon: 21.3711 },
  { naziv: "Despotovac", lat: 44.0957, lon: 21.4344 },
  { naziv: "Gornji Milanovac", lat: 44.0197, lon: 20.4597 },
  { naziv: "Ivanjica", lat: 43.5833, lon: 20.2333 },
  { naziv: "Jagodina", lat: 43.9764, lon: 21.2614 },
  { naziv: "Kikinda", lat: 45.8281, lon: 20.4619 },
  { naziv: "Kladovo", lat: 44.6094, lon: 22.6072 },
  { naziv: "Knić", lat: 43.9167, lon: 20.7167 },
  { naziv: "Knjaževac", lat: 43.5672, lon: 22.2578 },
  { naziv: "Kosjerić", lat: 43.9978, lon: 19.9197 },
  { naziv: "Kovačica", lat: 45.1103, lon: 20.6222 },
  { naziv: "Kovin", lat: 44.7458, lon: 20.9772 },
  { naziv: "Kraljevo", lat: 43.7228, lon: 20.6894 },
  { naziv: "Kragujevac", lat: 44.0128, lon: 20.9114 },
  { naziv: "Kruševac", lat: 43.5803, lon: 21.3281 },
  { naziv: "Krupanj", lat: 44.3667, lon: 19.3667 },
  { naziv: "Kuršumlija", lat: 43.1403, lon: 21.2711 },
  { naziv: "Lajkovac", lat: 44.3667, lon: 20.1667 },
  { naziv: "Lapovo", lat: 44.1833, lon: 21.0833 },
  { naziv: "Lebane", lat: 42.9167, lon: 21.7333 },
  { naziv: "Leskovac", lat: 42.9983, lon: 21.9461 },
  { naziv: "Loznica", lat: 44.5333, lon: 19.2167 },
  { naziv: "Ljubovija", lat: 44.1833, lon: 19.3667 },
  { naziv: "Majdanpek", lat: 44.4167, lon: 21.9333 },
  { naziv: "Mali Zvornik", lat: 44.3833, lon: 19.1167 },
  { naziv: "Medveđa", lat: 42.8333, lon: 21.5833 },
  { naziv: "Mionica", lat: 44.2500, lon: 20.0833 },
  { naziv: "Negotin", lat: 44.2267, lon: 22.5317 },
  { naziv: "Niš", lat: 43.3208, lon: 21.8958 },
  { naziv: "Nova Crnja", lat: 45.6667, lon: 20.6000 },
  { naziv: "Nova Varoš", lat: 43.4667, lon: 19.8167 },
  { naziv: "Novi Bečej", lat: 45.5981, lon: 20.1344 },
  { naziv: "Novi Kneževac", lat: 46.0500, lon: 20.1000 },
  { naziv: "Novi Pazar", lat: 43.1367, lon: 20.5122 },
  { naziv: "Novi Sad", lat: 45.2517, lon: 19.8369 },
  { naziv: "Opovo", lat: 45.0500, lon: 20.4333 },
  { naziv: "Osečina", lat: 44.3667, lon: 19.6000 },
  { naziv: "Pančevo", lat: 44.8708, lon: 20.6408 },
  { naziv: "Paraćin", lat: 43.8611, lon: 21.4083 },
  { naziv: "Pećinci", lat: 44.9000, lon: 19.9667 },
  { naziv: "Petrovac na Mlavi", lat: 44.3833, lon: 21.4167 },
  { naziv: "Pirot", lat: 43.1536, lon: 22.5864 },
  { naziv: "Požarevac", lat: 44.6197, lon: 21.1869 },
  { naziv: "Priboj", lat: 43.5833, lon: 19.5333 },
  { naziv: "Prijepolje", lat: 43.3917, lon: 19.6500 },
  { naziv: "Prokuplje", lat: 43.2333, lon: 21.5833 },
  { naziv: "Raška", lat: 43.2833, lon: 20.6167 },
  { naziv: "Ražanj", lat: 43.6667, lon: 21.5500 },
  { naziv: "Rekovac", lat: 43.8667, lon: 21.1167 },
  { naziv: "Ruma", lat: 45.0081, lon: 19.8208 },
  { naziv: "Sečanj", lat: 45.3667, lon: 20.7667 },
  { naziv: "Senta", lat: 45.9281, lon: 20.0819 },
  { naziv: "Sjenica", lat: 43.2667, lon: 20.0000 },
  { naziv: "Smederevo", lat: 44.6636, lon: 20.9272 },
  { naziv: "Smederevska Palanka", lat: 44.3667, lon: 20.9667 },
  { naziv: "Sokobanja", lat: 43.6436, lon: 21.8703 },
  { naziv: "Sombor", lat: 45.7761, lon: 19.1133 },
  { naziv: "Srbobran", lat: 45.5500, lon: 19.7833 },
  { naziv: "Sremska Mitrovica", lat: 44.9733, lon: 19.6117 },
  { naziv: "Sremski Karlovci", lat: 45.2000, lon: 19.9333 },
  { naziv: "Stara Pazova", lat: 44.9833, lon: 20.1667 },
  { naziv: "Subotica", lat: 46.1000, lon: 19.6667 },
  { naziv: "Surčin", lat: 44.8000, lon: 20.2833 },
  { naziv: "Svilajnac", lat: 44.2333, lon: 21.1833 },
  { naziv: "Svrljig", lat: 43.4167, lon: 22.1167 },
  { naziv: "Šabac", lat: 44.7553, lon: 19.6931 },
  { naziv: "Titel", lat: 45.2000, lon: 20.3000 },
  { naziv: "Topola", lat: 44.2500, lon: 20.6833 },
  { naziv: "Trgovište", lat: 42.3500, lon: 22.1167 },
  { naziv: "Trstenik", lat: 43.6167, lon: 21.0000 },
  { naziv: "Tutin", lat: 42.9833, lon: 20.3333 },
  { naziv: "Ub", lat: 44.4500, lon: 20.0667 },
  { naziv: "Užice", lat: 43.8553, lon: 19.8422 },
  { naziv: "Valjevo", lat: 44.2736, lon: 19.8869 },
  { naziv: "Varvarin", lat: 43.7167, lon: 21.3667 },
  { naziv: "Velika Plana", lat: 44.3333, lon: 21.0833 },
  { naziv: "Veliko Gradište", lat: 44.7500, lon: 21.5167 },
  { naziv: "Vladičin Han", lat: 42.7000, lon: 22.0667 },
  { naziv: "Vladimirci", lat: 44.6167, lon: 19.7833 },
  { naziv: "Vlasotince", lat: 42.9667, lon: 22.1333 },
  { naziv: "Vranje", lat: 42.5500, lon: 21.9000 },
  { naziv: "Vrnjačka Banja", lat: 43.6167, lon: 20.8833 },
  { naziv: "Zaječar", lat: 43.9053, lon: 22.2736 },
  { naziv: "Žabari", lat: 44.3667, lon: 21.2167 },
  { naziv: "Žabalj", lat: 45.3667, lon: 20.0500 },
  { naziv: "Žagubica", lat: 44.2000, lon: 21.7833 },
  { naziv: "Žitište", lat: 45.4833, lon: 20.5500 },
  { naziv: "Žitorađa", lat: 43.1833, lon: 21.7167 },
  { naziv: "Zrenjanin", lat: 45.3833, lon: 20.3833 },
]

const LokacijaContext = createContext(null)

export function LokacijaProvider({ children }) {
  const [opstina, setOpstina] = useState(
    () => {
      const saved = localStorage.getItem('agroOpstina')
      if (!saved) return null
      return OPSTINE.find(o => o.naziv === saved) || null
    }
  )

  useEffect(() => {
    if (opstina) {
      localStorage.setItem('agroOpstina', opstina.naziv)
    } else {
      localStorage.removeItem('agroOpstina')
    }
  }, [opstina])

  return (
    <LokacijaContext.Provider value={{ opstina, setOpstina, OPSTINE }}>
      {children}
    </LokacijaContext.Provider>
  )
}

export function useLokacija() {
  const ctx = useContext(LokacijaContext)
  if (!ctx) throw new Error('useLokacija mora biti unutar LokacijaProvider')
  return ctx
}
