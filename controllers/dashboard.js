const { response } = require('express')

const dashboard = {
    index(req, res) {
        const viewData = {
            title: 'Stations dashboard',
            stations: 'to be an array',
        }
        response.render('dashboard', viewData)
    },
}

module.exports = dashboard