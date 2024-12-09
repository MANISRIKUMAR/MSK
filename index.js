const apiKey = "a89b38c3d62aed4551b78ec3f29c3ab6"; // Replace with your actual API key
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const soundStatus = document.getElementById("sound-status");
const backgroundVideo = document.getElementById("background-video"); // Background video element

// Audio and video mapping based on weather conditions
const weatherMedia = {
  Clear: { sound: "sunny.mp3", video: "sunny.mp4" },
  Clouds: { sound: "wind.mp3", video: "wind.mp4" },
  Rain: { sound: "rain.mp3", video: "rain.mp4" },
  Snow: { sound: "snow.mp3", video: "snow.mp4" },
  Thunderstorm: { sound: "thunder.mp3", video: "thunder.mp4" },
  Drizzle: { sound: "drizzle.mp3", video: "drizzle.mp4" },
  Mist: { sound: "mist.mp3", video: "mist.mp4" }, // New entry for Mist
};

let currentAudio = null;

searchBtn.addEventListener("click", async () => {
  const city = document.getElementById("city").value;
  if (!city) {
    resultDiv.innerHTML = "Please enter a city name.";
    soundStatus.textContent = "";
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    const { main, weather, name } = data;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const weatherCondition = weather[0].main;

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Play the corresponding sound and update video
    if (weatherMedia[weatherCondition]) {
      currentAudio = new Audio(weatherMedia[weatherCondition].sound);
      currentAudio.play();
      soundStatus.textContent = `Playing ${weatherCondition.toLowerCase()} sound...`;

      // Update the background video
      backgroundVideo.setAttribute("src", weatherMedia[weatherCondition].video);
    } else {
      soundStatus.textContent = "No media available for this weather condition.";
      backgroundVideo.setAttribute("src", "videos/default.mp4");
    }

    resultDiv.innerHTML = `
      <h2>${name}</h2>
      <img src="${iconUrl}" alt="${weather[0].description}" />
      <p>Temperature: ${main.temp}°C</p>
      <p>Weather: ${weather[0].description}</p>
      <p>Humidity: ${main.humidity}%</p>
    `;
  } catch (error) {
    resultDiv.innerHTML = "Error fetching weather data.";
    backgroundVideo.setAttribute("src", "videos/default.mp4");
  }
});



