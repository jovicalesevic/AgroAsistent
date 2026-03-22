import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { LokacijaProvider } from './context/LokacijaContext'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Nedostaje VITE_CLERK_PUBLISHABLE_KEY u .env.local")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <LokacijaProvider>
        <App />
      </LokacijaProvider>
    </ClerkProvider>
  </StrictMode>
)

