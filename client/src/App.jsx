import Navbar from './components/Navbar'
import Agroinfo from './components/Agroinfo'
import EAgrar from './components/EAgrar'
import LokalniResursi from './components/LokalniResursi'
import BerzaKurs from './components/BerzaKurs'
import KorisniPortali from './components/KorisniPortali'
import Kalkulator from './components/Kalkulator'
import Beleznica from './components/Beleznica'
import Parcele from './components/Parcele'
import Footer from './components/Footer'
import OglasBanner from './components/OglasBanner'
import AdminPanel from './components/AdminPanel'

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
        <Parcele />
        <AdminPanel />
        <Footer />
      </main>
      <OglasBanner />
    </div>
  )
}

export default App
