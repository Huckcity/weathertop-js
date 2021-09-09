const User = require('../models/User')

const auth = {
  async currentUserID(id) {
    const user = await User.findById(id)
    return user._id
  },
  async currentUserInfo(id) {
    const user = await User.findById(id)
    return user
  },
}

module.exports = auth
