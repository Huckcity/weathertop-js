const helperUtils = {
  dateFormat: (date) => {
    return date.toLocaleDateString();
  },
  json: (data) => {
    return JSON.stringify(data);
  },
};

module.exports = helperUtils;
