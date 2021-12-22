const helperUtils = {
  dateFormat: (date) => {
    return date.toLocaleDateString();
  },
  json: (data) => {
    return JSON.stringify(data);
  },
  if_eq: (a, b, options) => {
    if (a == b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
};

module.exports = helperUtils;
