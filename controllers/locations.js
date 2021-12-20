const auth = require("../utils/auth");
const Location = require("../models/Location");
const Device = require("../models/Device");

const locations = {
  async locations(req, res) {
    try {
      const locations = await Location.find({
        userId: req.session.userId,
      }).lean();

      const viewData = {
        locations,
      };
      console.log(viewData);
      res.render("locations", viewData);
    } catch (err) {
      console.log(`Error rendering locations: ${err}`);
      res.redirect("/oops");
    }
  },
  async findOne(req, res) {
    Location.findById(req.params.id)
      .lean()
      .then((location) => {
        const viewData = {
          location,
        };
        res.render("location", viewData);
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/locations");
      });
  },
  async addLocation(req, res) {
    Location.create({
      name: req.body.name,
      devices: [],
      userId: await auth.currentUserID(req.session.userId),
    })
      .then((location) => {
        console.log({ msg: "Location added successfully:" + location });
        res.redirect("/locations");
      })
      .catch((err) => {
        console.log(err.message);
        res.status(400).json({ error: "Unable to add this location" });
        res.redirect("/locations");
      });
  },
  async addDevice(req, res) {
    const dev = new Device(req.body);
    Location.findByIdAndUpdate(req.params.id, {
      $push: { devices: dev },
    })
      .then(() => {
        res.redirect("/location/" + req.params.id);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(400).json({ error: "Unable to add this device" });
        res.redirect("/locations");
      });
  },
};

module.exports = locations;
