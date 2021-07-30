const User = require('../models/User')

const auth = {
  async currentUserID(id) {
    const user = await User.findById(id)
    return user._id
  },
}

module.exports = auth
