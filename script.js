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
  const locations = [
    {
      name: "Brus",
      key: "brus",
      latitude: 43.38,
      longitude: 21.03
    },
    {
      name: "Aleksandrovac",
      key: "aleksandrovac",
      latitude: 43.46,
      longitude: 21.05
    },
    {
      name: "Blace",
      key: "blace",
      latitude: 43.29,
      longitude: 21.29
    }
  ];

  const toCardinal = (degrees) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % directions.length;
    return directions[index];
  };

  const fetchWeather = (location) => {
    const tempEl = document.getElementById(`temp-${location.key}`);
    const humidityEl = document.getElementById(`humidity-${location.key}`);
    const windEl = document.getElementById(`wind-${location.key}`);
    const windDirEl = document.getElementById(`winddir-${location.key}`);
    const precipEl = document.getElementById(`precip-${location.key}`);
    const statusEl = document.getElementById(`status-${location.key}`);
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
        statusEl.textContent = "Podaci osvezeni.";
      })
      .catch(() => {
        statusEl.textContent = "Nije moguce ucitati podatke.";
      });
  };

  locations.forEach(fetchWeather);
});
