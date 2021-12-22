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
    Location.find({
      devices: {
        $elemMatch: {
          _id: req.params.device_id,
        },
      },
    })
      .lean()
      .then((location) => {
        const device = location[0].devices.find(
          (device) => device._id == req.params.device_id
        );

        const viewData = {
          location_id: req.params.location_id,
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
        "devices._id": req.params.device_id,
      },
      {
        $set: {
          "devices.$.name": req.body.name,
          "devices.$.subscription": req.body.subscription,
          "devices.$.parameters": req.body.parameters,
          "devices.$.type": req.body.type,
        },
      },
      (err) => {
        if (err) {
          console.log(err.message);
          res.status(400).json({ error: "Unable to update this device" });
          res.redirect("/location/" + req.params.location_id);
        } else {
          res.redirect("/location/" + req.params.location_id);
        }
      }
    );
  },
  async liveUpdateDevice(req, res) {
    Location.updateOne(
      {
        _id: req.body.location_id,
        devices: {
          $elemMatch: {
            _id: req.body._id,
          },
        },
      },
      {
        $push: {
          "devices.$[outer].history": req.body.value,
        },
      },
      {
        arrayFilters: [
          {
            "outer._id": req.body._id,
          },
        ],
      },
      (err) => {
        if (err) {
          console.log(err.message);
          res.status(400).json({ error: "Unable to update this device" });
        } else {
          res.status(200).json({ msg: "Success" });
        }
      }
    );
  },
  async deleteDevice(req, res) {
    Location.findByIdAndUpdate(req.params.location_id, {
      $pull: { devices: { _id: req.params.device_id } },
    })
      .then(() => {
        res.redirect("/location/" + req.params.location_id);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(400).json({ error: "Unable to delete this device" });
        res.redirect("/locations");
      });
  },
};

module.exports = locations;
