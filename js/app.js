
const apiKey = "53f070eb45aa431085b223028230712"
const cityName = "Paris"
// const cityName = "auto:ip"
async function getData() {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=5
`)
    return await response.json()
}


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
}


createElements()