const apiKey = "53f070eb45aa431085b223028230712"


/*
Returns weather JSON based on city name
 */
async function getData(city) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5
`)
    return await response.json()
}

/*
Created weather window for a city
 */
async function createElements(city = "auto:ip") {
    document.body.classList.add("loading")
    const weatherData = await getData(city)

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
        case element.includes("rain"):
            icon = "rain.svg"
            break;
        case element.includes("snow"):
            icon = "snow.svg"
            break;
        case element.includes("storm"):
            icon = "thunderstorm.svg"
            break;
        case element.includes("fog"):
            icon = "fog.svg"
            break;
        case element.includes("hail"):
            icon = "hail.svg"
            break;
        case element.includes("cloudy"):
            icon = "cloudy.svg"
            break;
        case element.includes("clear"):
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
    console.log(closeButtons)
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const parentElement = button.parentNode;
            parentElement.setAttribute("hidden", "")
        })
    })
}

/*
Adds new city
 */
function addCity () {
    const $addCityButton = document.querySelector("#add-city")
    const $addCityForm = document.querySelector(".module__form")

    $addCityButton.addEventListener("click", () => {
        $addCityForm.removeAttribute("hidden")
    });

    const $searchButton = $addCityForm.querySelector(".find-city button");
    const $searchInput = $addCityForm.querySelector("#search")

    $searchButton.addEventListener("click", (e) => {
        e.preventDefault()
        createElements($searchInput.value.trim())
        $addCityForm.setAttribute("hidden", "")
    })


}


function main () {
    createElements()
    addCity()
}

main()
