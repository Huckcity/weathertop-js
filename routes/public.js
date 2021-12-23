const express = require("express");
const router = express.Router();
const locations = require("../controllers/locations");
const network = require("../controllers/network");
const home = require("../controllers/home");

/*** Home Routes ***/
router.get("/", home.index);
router.get("/register", home.register);
router.post("/register", home.doRegistration);
router.get("/about", home.about);
router.post("/login", home.login);

// Live update device route
router.post("/liveupdatedevice", locations.liveUpdateDevice);
router.post("/liveupdatenetworkdevice", network.liveupdatenetworkdevice);

module.exports = router;
