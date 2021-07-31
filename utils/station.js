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
}

module.exports = station
