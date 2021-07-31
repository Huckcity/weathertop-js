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
    station.latestWeatherDesc = getLatestWeatherDesc(latestReading.code)
    station.latestTemp = latestReading.temperature
    station.latestTempInFahrenheit = celciusToFahrenheit(
      latestReading.temperature
    )
    station.minTemp = getMinValue(station.readings, 'temperature')
    station.maxTemp = getMaxValue(station.readings, 'temperature')
    station.minWindSpeed = getMinValue(station.readings, 'windSpeed')
    station.maxWindSpeed = getMaxValue(station.readings, 'windSpeed')
    station.minPressure = getMinValue(station.readings, 'pressure')
    station.maxPressure = getMaxValue(station.readings, 'pressure')

    station.windBeaufort = getBeaufort(latestReading.windSpeed)
    station.windDirection = getWindDirection(latestReading.windDirection)
    station.windChill = getWindChill(
      latestReading.temperature,
      latestReading.windSpeed
    )

    return station
  },
  generateChartData(station) {
    const lastFiveReadings = station.readings.slice(station.readings.length - 5)
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
  return temp * (9 / 5) + 32
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
  if (windDirection >= 11.25 && windDirection <= 33.75)
    return 'North North East'
  if (windDirection >= 33.75 && windDirection <= 56.25) return 'North East'
  if (windDirection >= 56.25 && windDirection <= 78.75) return 'East North East'
  if (windDirection >= 78.75 && windDirection <= 101.25) return 'East'
  if (windDirection >= 101.25 && windDirection <= 123.75)
    return 'East South East'
  if (windDirection >= 123.75 && windDirection <= 146.25) return 'South East'
  if (windDirection >= 146.25 && windDirection <= 168.75)
    return 'South South East'
  if (windDirection >= 168.75 && windDirection <= 191.25) return 'South'
  if (windDirection >= 191.25 && windDirection <= 213.75)
    return 'South South West'
  if (windDirection >= 213.75 && windDirection <= 236.25) return 'South West'
  if (windDirection >= 236.25 && windDirection <= 258.75)
    return 'West South West'
  if (windDirection >= 258.75 && windDirection <= 281.25) return 'West'
  if (windDirection >= 281.25 && windDirection <= 303.75)
    return 'West North West'
  if (windDirection >= 303.75 && windDirection <= 326.25) return 'North West'
  if (windDirection >= 326.25 && windDirection <= 348.75)
    return 'North North West'
  if (windDirection >= 348.75 && windDirection <= 11.25) return 'North'
  return 'Unknown'
}

const getWindChill = (t, v) => {
  const windchill =
    13.12 +
    0.6215 * t -
    11.37 * Math.pow(v, 0.16) +
    0.3965 * t * Math.pow(v, 0.16)
  return windchill
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

const getLatestWeatherDesc = code => {
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
