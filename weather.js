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
        let leve = new Date(data.sys.sunrise * 1000);
        let couche = new Date(data.sys.sunset * 1000);
        let act = new Date();
        if (!(act>leve && act<couche))
        {
          document.getElementById("meteo").style.backgroundImage = "url('../assets/background_n.jpg')";
          document.getElementById("meteo").style.color = "#ebf5ee";
        }
        document.getElementById("table_aujourdhui").innerHTML = `
                        <td><p>Aujourd'hui</p></td>
                        <td>${leve.getUTCHours()}:${leve.getUTCMinutes()}</td>
                        <td>${couche.getUTCHours()}:${couche.getUTCMinutes()}</td>
                      `;
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
                    </div>
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
        },
        (error) => console.error("Error getting location:", error)
      );
    } else {
      console.error("La geolocalisation n'est pas supportée et/ou autorisée.");
    }
  },
};

document.getElementById("time-act").textContent = app.getTime().join(" : ");
app.getLocation();
