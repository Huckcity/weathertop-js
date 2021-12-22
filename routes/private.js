const router = require("express").Router();

const dashboard = require("../controllers/dashboard");
const stations = require("../controllers/stations");
const locations = require("../controllers/locations");

// Generic error route
router.get("/oops", dashboard.errorPage);

/*** Dashboard Routes ***/
router.get("/dashboard", dashboard.index);
router.get("/logout", dashboard.logout);
router.get("/profile", dashboard.profile);
router.post("/updateProfile", dashboard.updateProfile);

/*** Station Routes ***/
// Find station by ID
router.get("/stations/:id", stations.findOne);
// Add station
router.post("/stations/add", stations.addStation);
// Delete station
router.get("/stations/delete/:id", stations.deleteStation);
// Add reading to station
router.post("/stations/:id/addreading", stations.addReading);
// Detele reading from station
router.get("/stations/:station_id/delete/:reading_id", stations.deleteReading);
// Add OpenWeatherAPI reading to station
router.post("/stations/:id/autogenerate", stations.addAPIReading);

/*** Location Routes ***/
// All locations
router.get("/locations", locations.locations);
// Find location by ID
router.get("/location/:id", locations.findOne);
// Add location
router.post("/locations/add", locations.addLocation);
// Delete location
router.get("/locations/delete/:id", locations.deleteLocation);
// Add device to location
router.post("/locations/:id/add", locations.addDevice);
// Edit device page
router.get("/location/:location_id/:device_id", locations.editDevice);
// Update device
router.post("/updatedevice/:location_id/:device_id", locations.updateDevice);
// Delete device
router.get("/location/:location_id/:device_id/delete", locations.deleteDevice);

module.exports = router;
