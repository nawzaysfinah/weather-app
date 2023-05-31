// API keys
const weatherAPIKey = "24f904ec6d8337f1ff046bf93d72f02e";
const giphyAPIKey = "- ARNGRyAV5a9AnxmSL8eS4EF3QKadwvy0";

// DOM elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const temperatureToggle = document.getElementById("temperature-toggle");
const mainDisplay = document.getElementById("main-display");
const subDisplay = document.getElementById("sub-display");

const weatherIcons = {
  "clear sky": "wi wi-day-sunny",
  "few clouds": "wi wi-day-cloudy",
  "scattered clouds": "wi wi-cloud",
  "broken clouds": "wi wi-cloudy",
  "shower rain": "wi wi-showers",
  "light rain": "wi wi-rain",
  // thunderstorm: "wi wi-thunderstorm",
  // snow: "wi wi-snow",
  // mist: "wi wi-fog",
};

// Event listeners
searchButton.addEventListener("click", searchWeather);
temperatureToggle.addEventListener("click", toggleTemperatureUnit);

// Attach event listener to search input field for handling Enter key press
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchWeather();
  }
});

// Fetch weather data from OpenWeatherMap API
function fetchWeatherData(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherAPIKey}&units=metric`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.log("Error fetching weather data:", error);
    });
}

// Update main display with weather data
function updateMainDisplay(weatherData) {
  // Extract required information from weatherData object
  const temperature = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const windSpeed = convertWindSpeed(weatherData.wind.speed);
  const feelsLike = weatherData.main.feels_like;
  const chanceOfRain = weatherData.clouds.all;

  // Update the DOM elements with the obtained weather data
  mainDisplay.innerHTML = `
  <p><i class="fas fa-thermometer-half"></i> Temperature: ${temperature.toFixed(
    2
  )} &#176;C</p>
  <p><i class="fas fa-tint"></i> Humidity: ${humidity}%</p>
  <p><i class="fas fa-wind"></i> Wind Speed: ${windSpeed.toFixed(2)} km/h</p>
  <p><i class="fas fa-temperature-low"></i> Feels Like: ${feelsLike.toFixed(
    2
  )} &#176;C</p>
  <p><i class="fas fa-cloud-showers-heavy"></i> Chance of Rain: ${chanceOfRain}%</p>
`;
}

function convertWindSpeed(speed) {
  return speed * 1.60934;
}

// Fetch 7-day forecast from OpenWeatherMap API
function fetchForecast(location) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${weatherAPIKey}&units=metric`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.log("Error fetching forecast:", error);
    });
}

// Update sub display with forecast data
function updateSubDisplay(forecastData) {
  const forecasts = forecastData.list.slice(0, 7);

  subDisplay.innerHTML = "";

  forecasts.forEach((forecast) => {
    const date = new Date(forecast.dt_txt);
    const temperature = forecast.main.temp;
    const weatherDescription = forecast.weather[0].description;

    // Get the corresponding Weather Icons class name for the weather description
    const iconClassName = weatherIcons[weatherDescription];

    const forecastElement = document.createElement("div");
    forecastElement.innerHTML = `
      <p>Date: ${date.toLocaleDateString()}</p>
      <p><i class="wi wi-thermometer"></i> Temperature: ${temperature.toFixed(
        2
      )} &#176;C</p>
      <p>Forecast: <i class="${iconClassName}"></i> ${weatherDescription}</p>
      <hr>
    `;

    subDisplay.appendChild(forecastElement);
  });
}

// // Update sub display with 7-day forecast
// function updateSubDisplay(forecastData) {
//   // Extract required information from forecastData object
//   const forecastList = forecastData.list.slice(0, 7); // Get only the first 7 days

//   // Clear existing content in sub display
//   subDisplay.innerHTML = "";

//   // Loop through forecast data and update the DOM elements
//   forecastList.forEach((dayData) => {
//     const date = dayData.dt_txt.split(" ")[0];
//     const temperature = dayData.main.temp;
//     const forecast = dayData.weather[0].description;

//     // Create a new element for each day's forecast
//     const dayElement = document.createElement("div");
//     dayElement.classList.add("forecast-day");
//     dayElement.innerHTML = `
//       <p><i class="fas fa-calendar-alt"></i> Date: ${date}</p>

//       <p><i class="fas fa-thermometer-half"></i> Temperature: ${temperature.toFixed(
//         2
//       )} &#176;C</p>
//       <p>Forecast: ${forecast}</p>
//     `;

//     subDisplay.appendChild(dayElement);
//   });
// }

// Search for a relevant GIF on GIPHY
function searchGIF(location) {
  const url = `https://api.giphy.com/v1/gifs/search?q=${location}&api_key=${giphyAPIKey}&limit=1`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.data[0].images.original.url)
    .catch((error) => {
      console.log("Error fetching GIF:", error);
    });
}

// Update app background with the fetched GIF
function updateBackgroundGIF(url) {
  document.body.style.backgroundImage = `url(${url})`;
}

// Handle search button click event
function searchWeather() {
  const location = searchInput.value;

  fetchWeatherData(location)
    .then((weatherData) => {
      updateMainDisplay(weatherData);
      return fetchForecast(location);
    })
    .then((forecastData) => {
      updateSubDisplay(forecastData);
      return searchGIF(location);
    })
    .then((gifURL) => {
      updateBackgroundGIF(gifURL);
    });

  // Clear search input field
  searchInput.value = "";
}
// Handle temperature unit toggle click event
function toggleTemperatureUnit() {
  const temperatureElement = mainDisplay.querySelector("p:first-child");
  const feelsLikeElement = mainDisplay.querySelector("p:nth-child(4)");
  const subDisplayTemperatures = subDisplay.querySelectorAll("p:nth-child(2)");

  // Get the current temperature unit from the main display
  const currentTemperature = parseFloat(
    temperatureElement.innerText.split(":")[1]
  );

  // Toggle between Fahrenheit and Celsius
  const temperatureUnit = temperatureToggle.innerText.includes("C") ? "F" : "C";
  const convertedTemperature =
    temperatureUnit === "C"
      ? ((currentTemperature - 32) * 5) / 9
      : currentTemperature;

  // Update temperature unit and value in the main display
  temperatureToggle.innerText = `Toggle to ${
    temperatureUnit === "C" ? "Fahrenheit" : "Celsius"
  }`;
  temperatureElement.innerHTML = `Temperature: ${convertedTemperature.toFixed(
    2
  )} &#176;${temperatureUnit}`;

  // Update feels like value in the main display
  const feelsLikeValue = parseFloat(feelsLikeElement.innerText.split(":")[1]);
  const convertedFeelsLike =
    temperatureUnit === "C" ? ((feelsLikeValue - 32) * 5) / 9 : feelsLikeValue;
  feelsLikeElement.innerHTML = `Feels Like: ${convertedFeelsLike.toFixed(
    2
  )} &#176;${temperatureUnit}`;

  // Update temperature unit and values in the sub display
  subDisplayTemperatures.forEach((temperatureElement) => {
    const temperatureValue = parseFloat(
      temperatureElement.innerText.split(":")[1]
    );
    const convertedSubTemperature =
      temperatureUnit === "C"
        ? ((temperatureValue - 32) * 5) / 9
        : temperatureValue;
    temperatureElement.innerHTML = `Temperature: ${convertedSubTemperature.toFixed(
      2
    )} &#176;${temperatureUnit}`;
  });
}
