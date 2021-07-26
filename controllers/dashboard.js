const Station = require("../models/Station")

const dashboard = {
    async index(req, res) {
        const stations = await Station.find().lean()
            .then(data => {
                return data
            })
            .catch(err => {
                console.log(err)
            })
        const viewData = {
            stations
        }
        console.log(viewData)
        res.render('dashboard', viewData)
    },
}

module.exports = dashboard
