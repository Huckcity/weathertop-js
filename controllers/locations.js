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
  async editDevice(req, res) {
    console.log(req.params.id);
    Location.find({
      devices: {
        $elemMatch: {
          _id: req.params.id,
        },
      },
    })
      .lean()
      .then((location) => {
        const device = location[0].devices.find(
          (device) => device._id == req.params.id
        );

        const viewData = {
          device,
        };
        res.render("editdevice", viewData);
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/locations");
      });
  },
  async deleteLocation(req, res) {
    Location.findByIdAndDelete(req.params.id)
      .then(() => {
        res.redirect("/locations");
      })
      .catch((err) => {
        console.log(err.message);
        res.status(400).json({ error: "Unable to delete this location" });
        res.redirect("/locations");
      });
  },
  async updateDevice(req, res) {
    Location.updateOne(
      {
        "devices._id": req.params.id,
      },
      {
        $set: {
          "devices.$.name": req.body.name,
        },
      },
      (err) => {
        if (err) {
          console.log(err.message);
          res.status(400).json({ error: "Unable to update this device" });
          res.redirect("/locations");
        } else {
          res.redirect("/location/" + req.params.id);
        }
      }
    );
  },
};

module.exports = locations;
