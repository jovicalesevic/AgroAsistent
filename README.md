# AgroAsistent

**AgroAsistent** is a web application designed to help Serbian farmers manage their agricultural activities efficiently. It provides quick access to weather data, field notes, parcel management, agricultural resources, and useful links — all in one place.

## Features

- 🌤️ **Real-time weather** — current conditions for any municipality in Serbia
- 📋 **Field notebook** — log daily agricultural activities
- 🌱 **Parcel management** — import and manage parcels from eAgrar
- 🧮 **Spray calculator** — calculate chemical application doses
- 📍 **Local resources** — find nearby agricultural pharmacies, vets, and markets
- 🔗 **Quick links** — eAgrar, subsidies, market prices, exchange rates, agricultural news
- 🔐 **Secure authentication** — via Clerk (email + Google)
- 📱 **PWA support** — installable on mobile devices

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Authentication | Clerk |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Deployment | Render |

## Project Structure
```
AgroAsistent/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── main.jsx
│   └── vite.config.js
└── server/          # Express backend
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── server.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Clerk account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jovicalesevic/AgroAsistent.git
cd AgroAsistent
```

2. Install dependencies:
```bash
# Root
npm install

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

3. Configure environment variables:

**server/.env**
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLIENT_URL=http://localhost:5173
```

**client/.env.local**
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

4. Run the application:
```bash
# From root folder
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment

The application is deployed on [Render](https://render.com) as two separate services:

- **Backend** (Web Service): `https://agroasistent.onrender.com`
- **Frontend** (Static Site): `https://agroasistent-client.onrender.com`

## License

MIT License — see [LICENSE](LICENSE) for details.

## Contact

📧 agroasistent.kontakt@gmail.com

---

# AgroAsistent

**AgroAsistent** je veb aplikacija namenjena srpskim poljoprivrednicima za efikasno upravljanje poljoprivrednim aktivnostima. Pruža brz pristup vremenskim podacima, beležnici radova, upravljanju parcelama, poljoprivrednim resursima i korisnim linkovima — sve na jednom mestu.

## Funkcionalnosti

- 🌤️ **Trenutno vreme** — vremenski uslovi za bilo koju opštinu u Srbiji
- 📋 **Beležnica radova** — evidentiranje dnevnih poljoprivrednih aktivnosti
- 🌱 **Upravljanje parcelama** — uvoz i pregled parcela iz eAgrara
- 🧮 **Kalkulator prskanja** — izračunavanje doze hemijskih sredstava
- 📍 **Lokalni resursi** — pretraga obližnjih agro apoteka, veterinara i pijaca
- 🔗 **Brzi linkovi** — eAgrar, subvencije, berzanske cene, kursna lista, agro vesti
- 🔐 **Sigurna autentifikacija** — putem Clerk-a (email + Google)
- 📱 **PWA podrška** — može se instalirati na mobilnom uređaju

## Tehnologije

| Sloj | Tehnologija |
|---|---|
| Frontend | React 19 + Vite 5 |
| Stilovi | Tailwind CSS 3 |
| Autentifikacija | Clerk |
| Backend | Node.js + Express |
| Baza podataka | MongoDB (Mongoose) |
| Deployment | Render |

## Struktura projekta
```
AgroAsistent/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── main.jsx
│   └── vite.config.js
└── server/          # Express backend
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── server.js
```

## Pokretanje lokalno

### Preduslovi
- Node.js 18+
- MongoDB Atlas nalog
- Clerk nalog

### Instalacija

1. Kloniraj repozitorijum:
```bash
git clone https://github.com/jovicalesevic/AgroAsistent.git
cd AgroAsistent
```

2. Instaliraj zavisnosti:
```bash
# Root
npm install

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

3. Podesi environment varijable:

**server/.env**
```
PORT=5000
MONGO_URI=tvoja_mongodb_uri
JWT_SECRET=tvoja_jwt_tajna
CLERK_SECRET_KEY=tvoj_clerk_secret_key
CLERK_PUBLISHABLE_KEY=tvoj_clerk_publishable_key
CLIENT_URL=http://localhost:5173
```

**client/.env.local**
```
VITE_CLERK_PUBLISHABLE_KEY=tvoj_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

4. Pokreni aplikaciju:
```bash
# Iz root foldera
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173`.

## Deployment

Aplikacija je deploovana na [Render](https://render.com) kao dva odvojena servisa:

- **Backend** (Web Service): `https://agroasistent.onrender.com`
- **Frontend** (Static Site): `https://agroasistent-client.onrender.com`

## Licenca

MIT licenca — pogledaj [LICENSE](LICENSE) za detalje.

## Kontakt

📧 agroasistent.kontakt@gmail.com
