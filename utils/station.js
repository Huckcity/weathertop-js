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
      labels.push(reading.created_on)
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
