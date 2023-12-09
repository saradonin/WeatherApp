const apiHost = "http://api.weatherapi.com"
const apiKey = "53f070eb45aa431085b223028230712"


/*
Returns weather JSON based on city name
 */
async function getData(city) {
    try {
        const response = await fetch(`${apiHost}/v1/forecast.json?key=${apiKey}&q=${city}&days=5`);
        if (!response.ok) {
            throw new Error("City not found");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        throw error;
    }
}


/*
Created weather window for a city
 */
async function createElements(city = "auto:ip") {
    try {
        document.body.classList.add("loading")
        const weatherData = await getData(city)
        console.log(weatherData)

        // Clone and add module
        const $originalWeatherModule = document.querySelector(".module__weather")
        const newWeatherModule = $originalWeatherModule.cloneNode(true)
        newWeatherModule.removeAttribute("hidden")

        const app = document.querySelector("#app")
        app.appendChild(newWeatherModule)

        // Set data items
        const cityName = weatherData.location.name
        const $cityName = newWeatherModule.querySelector(".city__name")
        $cityName.textContent = cityName

        const currentTemperature = weatherData.current.temp_c
        const $currentTemperature = newWeatherModule.querySelector(".temperature__value")
        $currentTemperature.textContent = currentTemperature

        const currentPressure = weatherData.current.pressure_mb
        const $currentPressure = newWeatherModule.querySelector(".pressure__value")
        $currentPressure.textContent = `${currentPressure} hPa`

        const currentHumidity = weatherData.current.humidity
        const $currentHumidity = newWeatherModule.querySelector(".humidity__value")
        $currentHumidity.textContent = `${currentHumidity}%`

        const currentWindSpeed = weatherData.current.wind_kph
        const $currentWindSpeed = newWeatherModule.querySelector(".wind-speed__value")
        $currentWindSpeed.textContent = `${(currentWindSpeed / 3.6).toFixed(1)} m/s`

        const currentCondition = weatherData.current.condition.text
        const $currentConditionIcon = newWeatherModule.querySelector(".weather__icon img")
        $currentConditionIcon.src = setIcon(currentCondition)


        // Forecast section
        const forecast = weatherData.forecast.forecastday
        const $forecastList = newWeatherModule.querySelector(".weather__forecast")
        forecast.forEach((day) => {
            const dayDate = new Date(day.date); // Convert the date string to a Date object
            const dayName = getDayName(dayDate.getDay())
            const dayCondition = day.day.condition.text
            const dayTemp = day.day.maxtemp_c

            const li = document.createElement("li")
            const dayNameSpan = document.createElement("span")
            dayNameSpan.classList.add("day")
            dayNameSpan.textContent = dayName
            const img = document.createElement("img")
            img.src = setIcon(dayCondition)

            const dayTempSpan = document.createElement("span")
            dayTempSpan.classList.add("temperature")
            const degreeSymbol = document.createTextNode("\u00B0C");  // creates &deg;C symbol
            const dayTempValueSpan = document.createElement("span")
            dayTempValueSpan.classList.add("temperature__value")
            dayTempValueSpan.textContent = dayTemp
            dayTempSpan.appendChild(dayTempValueSpan)
            dayTempSpan.appendChild(degreeSymbol)

            li.appendChild(dayNameSpan)
            li.appendChild(img)
            li.appendChild(dayTempSpan)
            $forecastList.appendChild(li)
        });
        updateModules()
    } catch (error) {
        console.error("Error creating elements:", error.message);
    }
    document.body.classList.remove("loading")
}

/*
Returns day name
 */
function getDayName(dayNumber) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayNumber];
}

/*
Sets weather icon based on weather condition
 */
function setIcon(element) {
    const dirPath = 'assets/icons/'
    let icon = ""
    switch (true) {
        case ["Rain", "rain"].some(word => element.includes(word)):
            icon = "rain.svg"
            break;
        case ["Snow", "snow"].some(word => element.includes(word)):
            icon = "snow.svg"
            break;
        case ["Storm", "storm"].some(word => element.includes(word)):
            icon = "thunderstorm.svg"
            break;
        case ["Fog", "fog", "Foggy", "foggy"].some(word => element.includes(word)):
            icon = "fog.svg"
            break;
        case ["Hail", "hail"].some(word => element.includes(word)):
            icon = "hail.svg"
            break;
        case ["Cloudy", "cloudy"].some(word => element.includes(word)):
            icon = "cloudy.svg"
            break;
        case ["Clear", "clear", "Sunny", "sunny"].some(word => element.includes(word)):
            icon = "clear-day.svg"
            break;
        default:
            icon = "partly-cloudy-day.svg";
            break;
    }
    return `${dirPath}${icon}`
}


/*
Closes elements on click
 */
function updateModules() {
    const closeButtons = document.querySelectorAll(".btn--close")
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const parentElement = button.parentNode;
            parentElement.setAttribute("hidden", "")
        })
    })
}

/*
Replace Polish letters with English letters for search purpose
 */
function replacePolishLetters(text) {
    const replacements = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
        'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
    };
    return text.replace(/[ąćęłńóśźż]/gi, (letter) => replacements[letter] || letter);
}

/*
Adds new city
 */
function addCity() {
    const $addCityButton = document.querySelector("#add-city")
    const $addCityForm = document.querySelector(".module__form")

    $addCityButton.addEventListener("click", () => {
        $addCityForm.removeAttribute("hidden")
    });

    const $searchButton = $addCityForm.querySelector(".find-city button");
    const $searchInput = $addCityForm.querySelector("#search")

    $searchButton.addEventListener("click", (e) => {
        e.preventDefault()
        const searchCity = replacePolishLetters($searchInput.value.trim())
        createElements(searchCity)
        $searchInput.value = ""
        $addCityForm.setAttribute("hidden", "")
    })
}

/*
Main
 */
function main() {
    createElements()
    addCity()
}

main()
