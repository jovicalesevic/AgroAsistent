// Agro Asistent
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

document.addEventListener("DOMContentLoaded", async () => {
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
  const precipProbEl = document.getElementById("precip-prob-value");
  const frostWarningEl = document.getElementById("frost-warning");
  const sunriseEl = document.getElementById("sunrise-value");
  const sunsetEl = document.getElementById("sunset-value");
  const statusEl = document.getElementById("weather-status");
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

  const fetchWeather = (location) => {
    locationEl.textContent = location.name;
    setStatus("Ucitavanje...");

    const apiUrl =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      location.latitude +
      "&longitude=" +
      location.longitude +
      "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation&hourly=precipitation_probability&daily=sunrise,sunset&timezone=Europe%2FBelgrade";

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
        const temp = Math.round(current.temperature_2m);
        tempEl.textContent = temp;
        humidityEl.textContent = Math.round(current.relative_humidity_2m);
        windEl.textContent = Math.round(current.wind_speed_10m);
        if (windDirEl) {
          const windDirDegrees = Math.round(current.wind_direction_10m);
          windDirEl.textContent = `${toCardinal(windDirDegrees)} (${windDirDegrees}°)`;
        }
        precipEl.textContent = Number(current.precipitation).toFixed(1);

        let precipProb = "—";
        if (data.hourly && data.hourly.precipitation_probability && data.hourly.time) {
          const now = new Date();
          const times = data.hourly.time;
          let idx = times.findIndex((t) => new Date(t) > now);
          if (idx < 0) idx = 0;
          const nextFew = data.hourly.precipitation_probability.slice(idx, idx + 4);
          const maxProb = nextFew.length ? Math.max(...nextFew) : null;
          precipProb = maxProb !== null ? maxProb : "—";
        }
        if (precipProbEl) precipProbEl.textContent = precipProb;

        if (frostWarningEl) {
          if (temp < 3) {
            frostWarningEl.textContent = "⚠️ Moguć mraz!";
            frostWarningEl.classList.remove("hidden");
          } else {
            frostWarningEl.classList.add("hidden");
          }
        }

        const formatTime = (iso) => {
          if (!iso) return "—";
          const d = new Date(iso);
          return d.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" });
        };
        if (data.daily && data.daily.sunrise && data.daily.sunrise[0]) {
          if (sunriseEl) sunriseEl.textContent = formatTime(data.daily.sunrise[0]);
          if (sunsetEl) sunsetEl.textContent = formatTime(data.daily.sunset[0]);
        } else {
          if (sunriseEl) sunriseEl.textContent = "—";
          if (sunsetEl) sunsetEl.textContent = "—";
        }

        setStatus("Podaci osvezeni.");
      })
      .catch(() => {
        setStatus("Nije moguce ucitati podatke.");
      });
  };

  const reverseGeocode = (latitude, longitude) => {
    const url = `/api/location?latitude=${latitude}&longitude=${longitude}`;
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

  // Kalkulator zaštite – (litraža / 100) * doza
  const prskalicaInput = document.getElementById("prskalica-litara");
  const dozaInput = document.getElementById("doza-na-100l");
  const izracunajBtn = document.getElementById("izracunaj-doza-btn");
  const resetDozaBtn = document.getElementById("reset-doza-btn");
  const dozaRezultatEl = document.getElementById("doza-rezultat");

  document.querySelectorAll("[data-litara]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-litara");
      if (prskalicaInput && val) prskalicaInput.value = val;
    });
  });

  if (izracunajBtn && dozaRezultatEl) {
    izracunajBtn.addEventListener("click", () => {
      const litraza = parseFloat(prskalicaInput?.value) || 0;
      const doza = parseFloat(dozaInput?.value) || 0;
      if (litraza <= 0 || doza <= 0) {
        dozaRezultatEl.textContent = "Unesite validne vrednosti.";
        dozaRezultatEl.classList.remove("hidden");
        return;
      }
      const rezultat = (litraza / 100) * doza;
      dozaRezultatEl.textContent = `Rezultat: ${rezultat.toFixed(2)} g/ml`;
      dozaRezultatEl.classList.remove("hidden");
    });
  }

  if (resetDozaBtn) {
    resetDozaBtn.addEventListener("click", () => {
      if (prskalicaInput) prskalicaInput.value = "";
      if (dozaInput) dozaInput.value = "";
      if (dozaRezultatEl) {
        dozaRezultatEl.textContent = "";
        dozaRezultatEl.classList.add("hidden");
      }
    });
  }

  // Beležnica Radova – API (MongoDB)
  const API_BASE = "";
  const aktivnostInput = document.getElementById("aktivnost-input");
  const sacuvajAktivnostBtn = document.getElementById("sacuvaj-aktivnost-btn");
  const beleznicaLista = document.getElementById("beleznica-lista");
  const beleznicaKontejner = document.getElementById("beleznica-kontejner");
  const vidiAktivnostiBtn = document.getElementById("vidi-aktivnosti-btn");
  const obrisiSveBeleznicaBtn = document.getElementById("obrisi-sve-beleznica-btn");

  const formatDatumVreme = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const ucitajIPrikaziBeleske = async () => {
    if (!beleznicaLista) return;
    try {
      const res = await fetch(`${API_BASE}/api/beleske`);
      if (!res.ok) throw new Error("Greška pri učitavanju.");
      const list = await res.json();
      beleznicaLista.innerHTML = "";
      list.forEach((item) => {
        const li = document.createElement("li");
        li.className = item.zavrseno ? "beleznica-listica bg-yellow-200" : "beleznica-listica";
        li.dataset.id = item._id;
        const contentDiv = document.createElement("div");
        contentDiv.className = "flex flex-1 flex-col";
        const textEl = document.createElement("div");
        textEl.className = item.zavrseno ? "beleznica-listica-text line-through text-gray-500" : "beleznica-listica-text";
        textEl.textContent = item.text;
        const datumEl = document.createElement("div");
        datumEl.className = "beleznica-listica-datum";
        datumEl.textContent = formatDatumVreme(item.dateTime);
        contentDiv.appendChild(textEl);
        contentDiv.appendChild(datumEl);
        const btnGroup = document.createElement("div");
        btnGroup.className = "flex items-center gap-2 shrink-0";
        const btnZavrsi = document.createElement("button");
        btnZavrsi.type = "button";
        btnZavrsi.className = "flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700";
        btnZavrsi.setAttribute("aria-label", item.zavrseno ? "Otkrij aktivnost" : "Završi aktivnost");
        btnZavrsi.textContent = "✓";
        btnZavrsi.addEventListener("click", async () => {
          try {
            const toggleRes = await fetch(`${API_BASE}/api/beleske/${item._id}/toggle`, { method: "PUT" });
            if (toggleRes.ok) await ucitajIPrikaziBeleske();
          } catch (err) {
            console.error(err);
          }
        });
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "beleznica-obrisi-btn";
        btn.setAttribute("aria-label", "Obriši belešku");
        btn.textContent = "×";
        btn.addEventListener("click", async () => {
          try {
            const delRes = await fetch(`${API_BASE}/api/beleske/${item._id}`, { method: "DELETE" });
            if (delRes.ok) await ucitajIPrikaziBeleske();
          } catch (err) {
            console.error(err);
          }
        });
        btnGroup.appendChild(btnZavrsi);
        btnGroup.appendChild(btn);
        li.appendChild(contentDiv);
        li.appendChild(btnGroup);
        beleznicaLista.appendChild(li);
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (vidiAktivnostiBtn && beleznicaKontejner) {
    vidiAktivnostiBtn.addEventListener("click", () => {
      const isHidden = beleznicaKontejner.classList.contains("hidden");
      beleznicaKontejner.classList.toggle("hidden");
      vidiAktivnostiBtn.textContent = isHidden ? "Sakrij aktivnosti" : "Vidi aktivnosti";
    });
  }

  if (sacuvajAktivnostBtn && aktivnostInput) {
    sacuvajAktivnostBtn.addEventListener("click", async () => {
      const text = aktivnostInput.value.trim();
      if (!text) return;
      try {
        const res = await fetch(`${API_BASE}/api/beleske`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });
        if (res.ok) {
          await ucitajIPrikaziBeleske();
          aktivnostInput.value = "";
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (aktivnostInput) {
    aktivnostInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && sacuvajAktivnostBtn) sacuvajAktivnostBtn.click();
    });
  }

  if (obrisiSveBeleznicaBtn) {
    obrisiSveBeleznicaBtn.addEventListener("click", async () => {
      if (!confirm("Da li želite da obrišete sve beleške?")) return;
      try {
        const res = await fetch(`${API_BASE}/api/beleske`, { method: "DELETE" });
        if (res.ok) await ucitajIPrikaziBeleske();
      } catch (err) {
        console.error(err);
      }
    });
  }

  const tabBeleznica = document.getElementById("tab-beleznica");
  const tabParcele = document.getElementById("tab-parcele");
  const beleznicaView = document.getElementById("beleznica-view");
  const parceleView = document.getElementById("parcele-view");

  if (tabBeleznica && tabParcele && beleznicaView && parceleView) {
    tabBeleznica.addEventListener("click", () => {
      beleznicaView.classList.remove("hidden");
      parceleView.classList.add("hidden");
      tabBeleznica.classList.add("bg-amber-500");
      tabBeleznica.classList.remove("bg-forest-200");
      tabParcele.classList.remove("bg-amber-500");
      tabParcele.classList.add("bg-forest-200");
    });
    tabParcele.addEventListener("click", () => {
      parceleView.classList.remove("hidden");
      beleznicaView.classList.add("hidden");
      tabParcele.classList.add("bg-amber-500");
      tabParcele.classList.remove("bg-forest-200");
      tabBeleznica.classList.remove("bg-amber-500");
      tabBeleznica.classList.add("bg-forest-200");
      fetchParcele();
    });
  }

  const pasteArea = document.getElementById("pasteArea");
  const uveziParceleBtn = document.getElementById("uvezi-parcele-btn");
  const parceleList = document.getElementById("parceleList");

  const fetchParcele = async () => {
    if (!parceleList) return;
    try {
      const res = await fetch(`${API_BASE}/api/parcels`);
      if (!res.ok) throw new Error("Greška pri učitavanju.");
      const parcele = await res.json();
      parceleList.innerHTML = "";
      parcele.forEach((p) => {
        const card = document.createElement("div");
        card.className =
          "flex flex-col gap-2 rounded-xl border border-forest-200 bg-white p-4 shadow-sm";
        card.innerHTML = `
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-semibold text-forest-900">${p.katastarska_opstina} – ${p.broj_parcele}</div>
              ${p.naziv_parcele ? `<div class="text-sm text-forest-700">${p.naziv_parcele}</div>` : ""}
            </div>
            <span class="shrink-0 rounded-lg bg-forest-100 px-2 py-1 text-sm font-medium text-forest-800">${p.povrsina_ha} ha</span>
          </div>
          ${p.kultura ? `<div class="text-sm text-forest-600">${p.kultura}</div>` : ""}
        `;
        const btnUredi = document.createElement("button");
        btnUredi.type = "button";
        btnUredi.className = "mt-2 self-start rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700";
        btnUredi.textContent = "Uredi";
        btnUredi.addEventListener("click", async () => {
          const noviNaziv = prompt("Unesi lokalni naziv parcele:", p.naziv_parcele || "");
          if (noviNaziv === null) return;
          try {
            const putRes = await fetch(`${API_BASE}/api/parcels/${p._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ naziv_parcele: noviNaziv.trim() })
            });
            if (putRes.ok) await fetchParcele();
          } catch (err) {
            console.error(err);
          }
        });
        card.appendChild(btnUredi);
        parceleList.appendChild(card);
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (uveziParceleBtn && pasteArea) {
    uveziParceleBtn.addEventListener("click", async () => {
      const text = pasteArea.value.trim();
      if (!text) return;
      const redovi = text.split("\n");
      const parcele = [];
      for (const red of redovi) {
        if (!red.trim() || red.includes("Катастарска")) continue;
        const kolona = red.split("\t");
        if (kolona.length < 6) continue;
        parcele.push({
          katastarska_opstina: kolona[0] || "",
          broj_parcele: kolona[1] || "",
          naziv_parcele: kolona[2] || "",
          povrsina_ha: parseFloat((kolona[3] || "0").replace(",", ".")) || 0,
          kultura: kolona[5] || "",
          aktivna_obrada: true
        });
      }
      if (parcele.length === 0) return;
      try {
        const res = await fetch(`${API_BASE}/api/parcels/import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parcele)
        });
        if (res.ok) {
          pasteArea.value = "";
          await fetchParcele();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  await ucitajIPrikaziBeleske();

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
