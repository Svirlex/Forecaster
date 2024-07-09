

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey ="f4b623d55d1ccb91a57818c433af2501";

var isDay = true;

var timeResult;

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;

    if (city) {
        
        try {
            const weatherData = await getWeatherData(city);
            
            displayWeatherInfo(weatherData);
        } 
        catch (error) {
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Город не выбран");
    }
});

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ru`;
    

    const response = await fetch(apiUrl);

    

    if (!response.ok) {
        throw new Error("Не удалось получить данные о погоде");
    }

    return await response.json();
}



function displayWeatherInfo(data){
    console.log(data);
    const {coord: {lon, lat},
           dt: time,
           timezone: timezoneOffset,
           name: city, 
           main: {temp, humidity},
           timezone: tzOffset,
           sys: {sunrise},
           weather: [{description, id}]} = data;
    
    

    
    const date = new Date(time * 1000);

    // Get UTC time in milliseconds
    const utcTime = date.getTime();
    
    // Apply the timezone offset (convert seconds to milliseconds)
    const localTime = utcTime + tzOffset * 1000;
    
    // Create a new Date object with the local time
    const localDate = new Date(localTime);
    
    // Extract the local hour
    const localHour = localDate.getUTCHours();
    
    console.log(localHour);

    card.textContent = "";
    card.style.display = "flex";


    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Влажность: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    console.log(localHour);
    changeBackground(localHour);


    
}


function getWeatherEmoji(weatherId){
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            if (isDay) {
                return "☀️";    
            }
            else{
                return "🌕";
            }
              
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❓";
    }
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);

}


function changeBackground(hour){
    if (hour >= 6 && hour < 12) {
        console.log("morning");
        isDay = true;
        card.style.transition = "color 1s"; // add transition effect
        card.style.background = "linear-gradient(180deg, rgb(140, 206, 247), rgba(255, 225, 169, 0.71))";
        card.style.color = "rgba(0, 0, 0, 0.75)";
      } else if (hour >= 12 && hour < 18) {
        console.log("afternoon");
        isDay = true;
        card.style.transition = "color 1s"; // add transition effect
        card.style.background = "linear-gradient(180deg,#5584ba, #CCE3F7)";
        card.style.color = "rgba(0, 0, 0, 0.75)";
      } else if (hour >= 18 && hour < 22) {
        console.log("evening");
        isDay = true;
        card.style.transition = "color 1s"; // add transition effect
        card.style.background = "linear-gradient(#729fd6, #d0c8b3, #fe9c36)";
        card.style.color = "rgba(255, 255, 255, 0.95)";
      } else {
        console.log("night");
        isDay = false;
        card.style.transition = "color 1s"; // add transition effect
        card.style.background = "linear-gradient(180deg, #00082d, #284a7d)";
        card.style.color = "rgba(255, 255, 255, 0.95)";
      }
}