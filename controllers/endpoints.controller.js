const { fetchEndpoints } = require("../models/endpoints.model");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints().then((endpoints) => {
    res.status(200).send({endpoints})
  });
};
