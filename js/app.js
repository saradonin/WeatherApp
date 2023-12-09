const apiKey = "53f070eb45aa431085b223028230712"
const cityName = "Milan"
// const cityName = "auto:ip"


/*
Returns weather JSON based on city name
 */
async function getData() {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=5
`)
    return await response.json()
}

/*
Created weather window for a city
 */
async function createElements() {
    const weatherData = await getData()
    console.log(weatherData)

    const cityName = weatherData.location.name
    const $cityName = document.querySelector(".city__name")
    $cityName.textContent = cityName

    const currentTemperature = weatherData.current.temp_c
    const $currentTemperature = document.querySelector(".temperature__value")
    $currentTemperature.textContent = currentTemperature

    const currentPressure = weatherData.current.pressure_mb
    const $currentPressure = document.querySelector(".pressure__value")
    $currentPressure.textContent = `${currentPressure} hPa`

    const currentHumidity = weatherData.current.humidity
    const $currentHumidity = document.querySelector(".humidity__value")
    $currentHumidity.textContent = `${currentHumidity}%`

    const currentWindSpeed = weatherData.current.wind_kph
    const $currentWindSpeed = document.querySelector(".wind-speed__value")
    $currentWindSpeed.textContent = `${(currentWindSpeed / 3.6).toFixed(1)} m/s`

    const currentCondition = weatherData.current.condition.text
    const $currentConditionIcon = document.querySelector(".weather__icon img")
    $currentConditionIcon.src = setIcon(currentCondition)

    const forecast = weatherData.forecast.forecastday
    const $forecastList = document.querySelector(".weather__forecast")
    forecast.forEach((day, index) => {
        const dayDate = new Date(day.date); // Convert the date string to a Date object
        const dayName = getDayName(dayDate.getDay())
        const dayCondition = day.day.condition.text
        const dayTemp = day.day.maxtemp_c

        console.log(dayName, dayCondition, dayTemp);

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

const $addCityButton = document.querySelector("#add-city")
const $addCityForm = document.querySelector(".module__form")

$addCityButton.addEventListener("click", () => {
    $addCityForm.removeAttribute("hidden")
});


// TODO this only hides first, make it work for all items
const closeButton = document.querySelector(".btn--close")
closeButton.addEventListener("click", () => {
    const parentElement = closeButton.parentNode;
    parentElement.setAttribute("hidden", "")
})

createElements()