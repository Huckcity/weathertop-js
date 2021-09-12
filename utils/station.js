const helpers = require('./helpers')

const station = {
  sortStationsAlphabetically(stations) {
    let res = stations.sort((x, y) => {
      let nameA = x.name.toUpperCase()
      let nameB = y.name.toUpperCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })
    return res
  },
  generateLatestWeather(station) {
    const latestReading = station.readings[station.readings.length - 1]
    station.latestWeatherIcon = getLatestWeatherIcon(latestReading.code, latestReading.auto_gen)
    station.latestWeatherDesc = getLatestWeatherDesc(latestReading.code, latestReading.auto_gen)
    station.latestTemp = latestReading.temperature
    station.latestTempInFahrenheit = celciusToFahrenheit(latestReading.temperature)
    station.latestPressure = latestReading.pressure
    station.minTemp = getMinValue(station.readings, 'temperature')
    station.maxTemp = getMaxValue(station.readings, 'temperature')
    station.minWindSpeed = getMinValue(station.readings, 'windSpeed')
    station.maxWindSpeed = getMaxValue(station.readings, 'windSpeed')
    station.minPressure = getMinValue(station.readings, 'pressure')
    station.maxPressure = getMaxValue(station.readings, 'pressure')

    station.windBeaufort = getBeaufort(latestReading.windSpeed)
    station.windDirection = getWindDirection(latestReading.windDirection)
    station.windChill = getWindChill(latestReading.temperature, latestReading.windSpeed)

    station.tempTrend = getTempTrend(station)
    station.windTrend = getWindTrend(station)
    station.pressureTrend = getPressureTrend(station)

    return station
  },
  generateChartData(station) {
    let lastFiveReadings = station.readings
    if (station.readings.length > 5) {
      lastFiveReadings = station.readings.slice(station.readings.length - 5)
    }
    const labels = []
    const pressure = {
      name: 'Pressure',
      type: 'line',
      values: [],
    }
    const temperature = {
      name: 'Temperature',
      type: 'line',
      values: [],
    }
    const windspeed = {
      name: 'Wind Speed',
      type: 'line',
      values: [],
    }
    lastFiveReadings.forEach(reading => {
      labels.push(helpers.dateFormat(reading.created_on))
      temperature.values.push(reading.temperature)
      pressure.values.push(reading.pressure)
      windspeed.values.push(reading.windSpeed)
    })

    const temperatureChart = {
      labels,
      datasets: [temperature],
    }
    const pressureChart = {
      labels,
      datasets: [pressure],
    }
    const windspeedChart = {
      labels,
      datasets: [windspeed],
    }
    const chartData = {
      temperatureChart: JSON.stringify(temperatureChart),
      pressureChart: JSON.stringify(pressureChart),
      windspeedChart: JSON.stringify(windspeedChart),
    }
    return chartData
  },
}

module.exports = station

const celciusToFahrenheit = temp => {
  return Math.round(((temp * (9 / 5) + 32) * 100) / 100)
}

const getMinValue = (readings, value) => {
  const minReading = readings.reduce((a, b) => {
    if (b[value] < a[value]) return b
    return a
  })
  return minReading[value]
}

const getMaxValue = (readings, value) => {
  const maxReading = readings.reduce((a, b) => {
    if (b[value] > a[value]) return b
    return a
  })
  return maxReading[value]
}

const getWindDirection = windDirection => {
  if (windDirection >= 11.25 && windDirection <= 33.75) return 'North North East'
  if (windDirection >= 33.75 && windDirection <= 56.25) return 'North East'
  if (windDirection >= 56.25 && windDirection <= 78.75) return 'East North East'
  if (windDirection >= 78.75 && windDirection <= 101.25) return 'East'
  if (windDirection >= 101.25 && windDirection <= 123.75) return 'East South East'
  if (windDirection >= 123.75 && windDirection <= 146.25) return 'South East'
  if (windDirection >= 146.25 && windDirection <= 168.75) return 'South South East'
  if (windDirection >= 168.75 && windDirection <= 191.25) return 'South'
  if (windDirection >= 191.25 && windDirection <= 213.75) return 'South South West'
  if (windDirection >= 213.75 && windDirection <= 236.25) return 'South West'
  if (windDirection >= 236.25 && windDirection <= 258.75) return 'West South West'
  if (windDirection >= 258.75 && windDirection <= 281.25) return 'West'
  if (windDirection >= 281.25 && windDirection <= 303.75) return 'West North West'
  if (windDirection >= 303.75 && windDirection <= 326.25) return 'North West'
  if (windDirection >= 326.25 && windDirection <= 348.75) return 'North North West'
  if (windDirection >= 348.75 && windDirection <= 11.25) return 'North'
  return 'Unknown'
}

const getWindChill = (t, v) => {
  const windchill = 13.12 + 0.6215 * t - 11.37 * Math.pow(v, 0.16) + 0.3965 * t * Math.pow(v, 0.16)
  return Math.round(windchill * 100) / 100
}

const getBeaufort = windSpeed => {
  if (windSpeed <= 1) return 0
  if (windSpeed <= 5) return 1
  if (windSpeed <= 11) return 2
  if (windSpeed <= 19) return 3
  if (windSpeed <= 28) return 4
  if (windSpeed <= 38) return 5
  if (windSpeed <= 49) return 6
  if (windSpeed <= 61) return 7
  if (windSpeed <= 74) return 8
  if (windSpeed <= 88) return 9
  if (windSpeed <= 102) return 10
  if (windSpeed <= 117) return 11
}

const getLatestWeatherDesc = (code, auto_gen) => {
  if (auto_gen) {
    if (code >= 200 && code <= 232) {
      return 'Thunder'
    }
    if (code >= 300 && code <= 321) {
      return 'Light Rain'
    }
    if (code == 500 || code == 501 || code == 521) {
      return 'Rain'
    }
    if (code == 502 || code == 504 || code == 522) {
      return 'Heavy Rain'
    }
    if (code >= 600 && code <= 622) {
      return 'Snow'
    }
    if (code == 800) {
      return 'Clear'
    }
    if (code >= 801 && code <= 802) {
      return 'Partial Cloud'
    }
    if (code >= 803 && code <= 804) {
      return 'Cloudy'
    }
  } else {
    switch (code) {
      case 100:
        return 'Clear'
      case 200:
        return 'Partial Clouds'
      case 300:
        return 'Cloudy'
      case 400:
        return 'Light Showers'
      case 500:
        return 'Heavy Showers'
      case 600:
        return 'Rain'
      case 700:
        return 'Snow'
      case 800:
        return 'Thunder'
      default:
        return 'Error!'
    }
  }
}

const getLatestWeatherIcon = (code, auto_gen) => {
  const base_icons = {
    100: 'bi-sun',
    200: 'bi-cloud-sun',
    300: 'bi-cloud',
    400: 'bi-cloud-drizzle',
    500: 'bi-cloud-rain-heavy',
    600: 'bi-cloud-rain',
    700: 'bi-cloud-snow',
    800: 'bi-cloud-lightning',
  }

  if (auto_gen) {
    if (code >= 200 && code <= 232) {
      return 'bi-cloud-lightning'
    }
    if (code >= 300 && code <= 321) {
      return 'bi-cloud-drizzle'
    }
    if (code == 500 || code == 501 || code == 521) {
      return 'bi-cloud-rain'
    }
    if (code == 502 || code == 504 || code == 522) {
      return 'bi-cloud-rain-heavy'
    }
    if (code >= 600 && code <= 622) {
      return 'bi-cloud-snow'
    }
    if (code == 800) {
      return 'bi-brightness-high'
    }
    if (code >= 801 && code <= 802) {
      return 'bi-cloud-sun'
    }
    if (code >= 803 && code <= 804) {
      return 'bi-cloud'
    }
  } else {
    return base_icons[code]
  }
}

const getTempTrend = station => {
  if (station.readings.length > 2) {
    let lastThreeReadings = station.readings.slice(station.readings.length-3, station.readings.length)
    if (lastThreeReadings[2].temperature > lastThreeReadings[1].temperature && lastThreeReadings[1].temperature > lastThreeReadings[0].temperature) {
      return 'up'
    }
    if (lastThreeReadings[2].temperature < lastThreeReadings[1].temperature && lastThreeReadings[1].temperature < lastThreeReadings[0].temperature) {
      return 'down'
    }
    return 'none'
  }
}

const getWindTrend = station => {
  if (station.readings.length > 2) {
    let lastThreeReadings = station.readings.slice(station.readings.length-3, station.readings.length)
    if (lastThreeReadings[2].windSpeed > lastThreeReadings[1].windSpeed && lastThreeReadings[1].windSpeed > lastThreeReadings[0].windSpeed) {
      return 'up'
    }
    if (lastThreeReadings[2].windSpeed < lastThreeReadings[1].windSpeed && lastThreeReadings[1].windSpeed < lastThreeReadings[0].windSpeed) {
      return 'down'
    }
    return 'none'
  }
}

const getPressureTrend = station => {
  if (station.readings.length > 2) {
    let lastThreeReadings = station.readings.slice(station.readings.length-3, station.readings.length)
    if (lastThreeReadings[2].pressure > lastThreeReadings[1].pressure && lastThreeReadings[1].pressure > lastThreeReadings[0].pressure) {
      return 'up'
    }
    if (lastThreeReadings[2].pressure < lastThreeReadings[1].pressure && lastThreeReadings[1].pressure < lastThreeReadings[0].pressure) {
      return 'down'
    }
    return 'none'
  }
}