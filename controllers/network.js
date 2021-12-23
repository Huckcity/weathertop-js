const auth = require("../utils/auth");
const NetworkDevice = require("../models/NetworkDevice");

const network = {
  async index(req, res) {
    const user = await auth.currentUserInfo(req.session.userId);
    try {
      const networkDevices = await NetworkDevice.find({
        userId: req.session.userId,
      }).lean();
      const viewData = {
        user,
        networkDevices,
      };
      console.log(viewData);
      res.render("network", viewData);
    } catch (err) {
      console.log(`Error rendering networkDevices: ${err}`);
      res.redirect("/oops");
    }
  },
  async addDevice(req, res) {
    try {
      const { name, mac_address } = req.body;
      const newNetworkDevice = new NetworkDevice({
        name,
        mac_address,
        userId: req.session.userId,
      });
      await newNetworkDevice.save();
      res.redirect("/network");
    } catch (err) {
      console.log(`Error adding network device: ${err}`);
      res.redirect("/oops");
    }
  },
  async liveupdatenetworkdevice(req, res) {
    console.log("new live status: " + req.body.online);
    NetworkDevice.updateOne(
      { _id: req.body._id },
      { $set: { online: req.body.online } }
    )
      .then(() => {
        console.log("Device live updated!");
        res.sendStatus(200);
      })
      .catch((err) => {
        res.sendStatus(400);
        console.log(err);
      });
  },
};

module.exports = network;
