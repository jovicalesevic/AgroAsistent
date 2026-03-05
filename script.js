window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f2f7f2",
          100: "#dfeee1",
          200: "#b6d8bb",
          300: "#8ec198",
          400: "#5e9f6a",
          500: "#3f7f4d",
          600: "#2f6a3e",
          700: "#255534",
          800: "#1f452b",
          900: "#183723"
        }
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const DEFAULT_LOCATION = {
    name: "Brus",
    latitude: 43.45,
    longitude: 21.11
  };

  const locationEl = document.getElementById("weather-location");
  const tempEl = document.getElementById("temp-value");
  const humidityEl = document.getElementById("humidity-value");
  const windEl = document.getElementById("wind-value");
  const windDirEl = document.getElementById("winddir-value");
  const precipEl = document.getElementById("precip-value");
  const statusEl = document.getElementById("weather-status");
  const forecastLinkEl = document.getElementById("forecast-link");
  const inputEl = document.getElementById("location-input");
  const buttonEl = document.getElementById("location-btn");

  const toCardinal = (degrees) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % directions.length;
    return directions[index];
  };

  const setStatus = (text) => {
    statusEl.textContent = text;
  };

  const updateForecastLink = (locationName) => {
    const query = encodeURIComponent(locationName);
    forecastLinkEl.href = `https://www.yr.no/en/search?q=${query}`;
  };

  const fetchWeather = (location) => {
    locationEl.textContent = location.name;
    updateForecastLink(location.name);
    setStatus("Ucitavanje...");

    const apiUrl =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      location.latitude +
      "&longitude=" +
      location.longitude +
      "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation&timezone=Europe%2FBelgrade";

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bad response");
        }
        return response.json();
      })
      .then((data) => {
        const current = data && data.current ? data.current : null;
        if (!current) {
          throw new Error("No data");
        }
        tempEl.textContent = Math.round(current.temperature_2m);
        humidityEl.textContent = Math.round(current.relative_humidity_2m);
        windEl.textContent = Math.round(current.wind_speed_10m);
        const windDirDegrees = Math.round(current.wind_direction_10m);
        windDirEl.textContent = `${toCardinal(windDirDegrees)} (${windDirDegrees}°)`;
        precipEl.textContent = Number(current.precipitation).toFixed(1);
        setStatus("Podaci osvezeni.");
      })
      .catch(() => {
        setStatus("Nije moguce ucitati podatke.");
      });
  };

  const reverseGeocode = (latitude, longitude) => {
    const url =
      "https://geocoding-api.open-meteo.com/v1/reverse?latitude=" +
      latitude +
      "&longitude=" +
      longitude +
      "&language=sr&format=json";
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bad response");
        }
        return response.json();
      })
      .then((data) => {
        if (!data || !data.results || !data.results.length) {
          return null;
        }
        const result = data.results[0];
        const parts = [result.name, result.admin1].filter(Boolean);
        return parts.join(", ");
      })
      .catch(() => null);
  };

  const geocodeByName = (name) => {
    const url =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(name) +
      "&count=1&language=sr&format=json";
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bad response");
        }
        return response.json();
      })
      .then((data) => {
        if (!data || !data.results || !data.results.length) {
          return null;
        }
        const result = data.results[0];
        return {
          name: result.name,
          latitude: result.latitude,
          longitude: result.longitude
        };
      })
      .catch(() => null);
  };

  const setLocationFromInput = () => {
    const value = inputEl.value.trim();
    if (!value) {
      setStatus("Unesite naziv mesta.");
      return;
    }
    setStatus("Tražim mesto...");
    geocodeByName(value).then((result) => {
      if (!result) {
        setStatus("Nije nadjeno mesto.");
        return;
      }
      fetchWeather(result);
    });
  };

  buttonEl.addEventListener("click", setLocationFromInput);
  inputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      setLocationFromInput();
    }
  });

  // Lokalni resursi - pretraga apoteke i veterinara (koristi sačuvanu lokaciju)
  const STORAGE_KEY = "agroAsistentLokacija";

  const savedLocationInput = document.getElementById("saved-location-input");
  const savedLocationBtn = document.getElementById("saved-location-btn");

  if (savedLocationInput) {
    savedLocationInput.value = localStorage.getItem(STORAGE_KEY) || "";
  }
  if (savedLocationBtn) {
    savedLocationBtn.addEventListener("click", () => {
      const val = (savedLocationInput?.value || "").trim() || "Brus";
      localStorage.setItem(STORAGE_KEY, val);
      if (savedLocationInput) savedLocationInput.value = val;
    });
  }

  const getLokacija = () => (localStorage.getItem(STORAGE_KEY) || "").trim() || "Brus";

  const btnApoteka = document.getElementById("btn-apoteka");
  const btnVeterinar = document.getElementById("veterinar-btn");

  const buildMapsUrl = (searchTerm) => {
    const lokacija = getLokacija();
    const query = `${searchTerm} ${lokacija} Srbija`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  if (btnApoteka) {
    btnApoteka.addEventListener("click", () => {
      const url = buildMapsUrl("poljoprivredna apoteka");
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  if (btnVeterinar) {
    btnVeterinar.addEventListener("click", () => {
      const url = buildMapsUrl("veterinar");
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  const yrnoBtn = document.getElementById("yrno-btn");
  if (yrnoBtn) {
    yrnoBtn.addEventListener("click", () => {
      const lokacija = getLokacija();
      const url = `https://www.yr.no/en/search?q=${encodeURIComponent(lokacija)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  // Kurs evra (NBS) – prikaz iz besplatnog API-ja
  const eurRateEl = document.getElementById("eur-rate");
  if (eurRateEl) {
    fetch("https://open.er-api.com/v6/latest/EUR")
      .then((r) => r.json())
      .then((data) => {
        const rsd = data?.rates?.RSD;
        if (typeof rsd === "number") {
          eurRateEl.textContent = `1 EUR = ${rsd.toFixed(2)} RSD`;
        }
      })
      .catch(() => {});
  }

  if (!navigator.geolocation) {
    fetchWeather(DEFAULT_LOCATION);
    return;
  }

  setStatus("Tražim lokaciju...");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      reverseGeocode(latitude, longitude).then((name) => {
        const locationName = name || "Moja lokacija";
        fetchWeather({
          name: locationName,
          latitude,
          longitude
        });
      });
    },
    () => {
      fetchWeather(DEFAULT_LOCATION);
    },
    {
      enableHighAccuracy: false,
      timeout: 6000,
      maximumAge: 300000
    }
  );
});
