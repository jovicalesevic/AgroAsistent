import Navbar from './components/Navbar'
import Agroinfo from './components/Agroinfo'
import EAgrar from './components/EAgrar'
import LokalniResursi from './components/LokalniResursi'
import BerzaKurs from './components/BerzaKurs'
import KorisniPortali from './components/KorisniPortali'
import Kalkulator from './components/Kalkulator'
import Beleznica from './components/Beleznica'

function App() {
  return (
    <div className="min-h-screen bg-forest-50 text-forest-900">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Agroinfo />
        <EAgrar />
        <LokalniResursi />
        <BerzaKurs />
        <KorisniPortali />
        <Kalkulator />
        <Beleznica />
      </main>
    </div>
  )
}

export default App
