import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-forest-50 text-forest-900">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-lg text-forest-700">Sadržaj dolazi ovde...</p>
      </main>
    </div>
  )
}

export default App
