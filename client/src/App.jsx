import Navbar from './components/Navbar'
import KorisniPortali from './components/KorisniPortali'
import Kalkulator from './components/Kalkulator'

function App() {
  return (
    <div className="min-h-screen bg-forest-50 text-forest-900">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <KorisniPortali />
        <Kalkulator />
      </main>
    </div>
  )
}

export default App
