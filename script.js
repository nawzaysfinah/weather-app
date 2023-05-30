// API keys
const weatherAPIKey = "24f904ec6d8337f1ff046bf93d72f02e";
const giphyAPIKey = "- ARNGRyAV5a9AnxmSL8eS4EF3QKadwvy0";

// DOM elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const temperatureToggle = document.getElementById("temperature-toggle");
const mainDisplay = document.getElementById("main-display");
const subDisplay = document.getElementById("sub-display");

// Event listeners
searchButton.addEventListener("click", searchWeather);
temperatureToggle.addEventListener("click", toggleTemperatureUnit);

// Fetch weather data from OpenWeatherMap API
function fetchWeatherData(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherAPIKey}`;

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
  const windSpeed = weatherData.wind.speed;
  const feelsLike = weatherData.main.feels_like;
  const chanceOfRain = weatherData.clouds.all;

  // Update the DOM elements with the obtained weather data
  mainDisplay.innerHTML = `
    <p>Temperature: ${temperature} &#176;F</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} mph</p>
    <p>Feels Like: ${feelsLike} &#176;F</p>
    <p>Chance of Rain: ${chanceOfRain}%</p>
  `;
}

// Fetch 7-day forecast from OpenWeatherMap API
function fetchForecast(location) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${weatherAPIKey}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.log("Error fetching forecast:", error);
    });
}

// Update sub display with 7-day forecast
function updateSubDisplay(forecastData) {
  // Extract required information from forecastData object
  const forecastList = forecastData.list.slice(0, 7); // Get only the first 7 days

  // Clear existing content in sub display
  subDisplay.innerHTML = "";

  // Loop through forecast data and update the DOM elements
  forecastList.forEach((dayData) => {
    const date = dayData.dt_txt.split(" ")[0];
    const temperature = dayData.main.temp;
    const forecast = dayData.weather[0].description;

    // Create a new element for each day's forecast
    const dayElement = document.createElement("div");
    dayElement.classList.add("forecast-day");
    dayElement.innerHTML = `
      <p>Date: ${date}</p>
      <p>Temperature: ${temperature} &#176;F</p>
      <p>Forecast: ${forecast}</p>
    `;

    subDisplay.appendChild(dayElement);
  });
}

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
  // Get the current temperature unit from the main display
  const currentTemperature = parseFloat(
    mainDisplay.querySelector("p:first-child").innerText.split(":")[1]
  );

  // Toggle between Fahrenheit and Celsius
  const temperatureUnit = temperatureToggle.innerText.includes("C") ? "F" : "C";
  const convertedTemperature =
    temperatureUnit === "C"
      ? ((currentTemperature - 32) * 5) / 9
      : (currentTemperature * 9) / 5 + 32;

  // Update temperature unit and value in the main display
  temperatureToggle.innerText = `Toggle to ${
    temperatureUnit === "C" ? "Fahrenheit" : "Celsius"
  }`;
  mainDisplay.querySelector(
    "p:first-child"
  ).innerText = `Temperature: ${convertedTemperature.toFixed(
    2
  )} &#176;${temperatureUnit}`;
}
