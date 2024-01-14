setInterval(
  (x) =>
    (document.getElementById("time-act").textContent = app
      .getTime()
      .join(" : ")),
  500
);

let app = {
  donnees: {
    apiKey: "93f4f2f761fd03a1c2b9fb32651a6994",
    latitude: 0,
    longitude: 0,
    date: {
      annee: 0,
      mois: 0,
      jours: 0,
      heures: 0,
      minutes: 0,
      secondes: 0,
    },
    soleil: {
      leve: 0,
      couche: 0,
    },
  },
  getTime() {
    let date = new Date();
    this.donnees.date.annee = date.getFullYear();
    this.donnees.date.mois = date.getMonth() + 1;
    this.donnees.date.jours = date.getDate();
    this.donnees.date.heures = date.getHours();
    this.donnees.date.minutes = date.getMinutes();
    this.donnees.date.secondes = date.getSeconds();
    //embelissement
    this.donnees.date.mois =
      this.donnees.date.mois < 10
        ? "0" + this.donnees.date.mois
        : this.donnees.date.mois;
    this.donnees.date.jours =
      this.donnees.date.jours < 10
        ? "0" + this.donnees.date.jours
        : this.donnees.date.jours;
    this.donnees.date.heures =
      this.donnees.date.heures < 10
        ? "0" + this.donnees.date.heures
        : this.donnees.date.heures;
    this.donnees.date.minutes =
      this.donnees.date.minutes < 10
        ? "0" + this.donnees.date.minutes
        : this.donnees.date.minutes;
    this.donnees.date.secondes =
      this.donnees.date.secondes < 10
        ? "0" + this.donnees.date.secondes
        : this.donnees.date.secondes;

    return [
      this.donnees.date.heures,
      this.donnees.date.minutes,
      this.donnees.date.secondes,
    ];
  },

  getWeatherNow() {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${this.donnees.latitude}&lon=${this.donnees.longitude}&appid=${this.donnees.apiKey}&units=metric&lang=fr`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById(
          "location"
        ).textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById(
          "temperature"
        ).textContent = `${data.main.temp}°C`;
        document.getElementById("description").textContent = `${
          data.weather[0].description[0].toUpperCase() +
          data.weather[0].description.substr(1)
        }`;
        const icon = data.weather[0].icon;
        document.title = `Météo - ${data.name}`;
        document.getElementById(
          "weather_icon"
        ).src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        this.donnees.soleil.leve = new Date(data.sys.sunrise * 1000);
        this.donnees.soleil.couche = new Date(data.sys.sunset * 1000);
        document.getElementById("h_leve").textContent = `
        ${this.donnees.soleil.leve.getHours()}:${this.donnees.soleil.leve.getMinutes()}
                      `;
        document.getElementById("h_couche").textContent = `
                        ${this.donnees.soleil.couche.getHours()}:${this.donnees.soleil.couche.getMinutes()}
                      `;
        let act = new Date();
        if (
          act < this.donnees.soleil.leve ||
          act > this.donnees.soleil.couche
        ) {
          document.getElementById("aiguille").style.opacity = "0";
        } else {
          let heure = act.getHours() - this.donnees.soleil.leve.getHours();
          let minute = act.getMinutes() - this.donnees.soleil.leve.getMinutes();
          let tot = heure * 60 + minute;
          document.getElementById("aiguille").style.transform = `rotate(${
            -20 + (tot % 180)
          }deg)`;
        }
      })
      .catch((error) => console.error("Error fetching weather data:", error));
  },

  getWeatherForecast() {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.donnees.latitude}&lon=${this.donnees.longitude}&appid=${this.donnees.apiKey}&units=metric&cnt=8&lang=fr`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        let prevision = data.list.map((elem) => {
          const date = new Date(elem.dt * 1000);
          const desc = elem.weather[0].description;
          return `<li>
                    <img src="${`https://openweathermap.org/img/wn/${elem.weather[0].icon}@2x.png`}"/>
                    <div class="secondaire"><p>${
                      date.getUTCDate() == this.donnees.date.jours
                        ? "Aujourd'hui"
                        : "Demain"
                    } - ${
            date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
          }:00</p><p>${elem.main.temp}°C</p><p>${
            desc[0].toUpperCase() + desc.substr(1)
          }</p>
                     
                  </li>`;
        });

        document.getElementById("previsions").innerHTML = prevision.join("");
      });
  },

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.donnees.latitude = position.coords.latitude;
          this.donnees.longitude = position.coords.longitude;
          this.getWeatherNow();
          this.getWeatherForecast();
          this.setCitation();
        },
        (error) => console.error("Error getting location:", error)
      );
    } else {
      console.error("La geolocalisation n'est pas supportée et/ou autorisée.");
    }
  },

  setCitation() {
    fetch("./js/quotes.json")
      .then((response) => response.json())
      .then((data) => {
        const i = (parseInt(this.donnees.date.jours) + parseInt(this.donnees.date.mois))%data.citations.length;
          const citation = data.citations[i];
          document.getElementById("citation").textContent = citation.texte;
          document.getElementById("auteur").textContent = citation.auteur;
      })
      .catch((error) =>
        console.error("Erreur lors du chargement du fichier JSON:", error)
      );
  },
};

document.getElementById("time-act").textContent = app.getTime().join(" : ");
app.getLocation();
