const fs = require("fs/promises");

exports.fetchEndpoints = () => {
  return fs
    .readFile("endpoints.json", "utf8", (err, endpointsData) => {
      return endpointsData;
    })
    .then((data) => {
      const parsedEndpoints = JSON.parse(data);
      return parsedEndpoints;
    });
};
