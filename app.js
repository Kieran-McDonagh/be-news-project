const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoints.controller");
const app = express();

app.use(express.json());

app.get('/api', getEndpoints)

app.get("/api/topics", getTopics);


app.use((err, req, res, next) => {
  res.status(500).send({ msg: err });
});

module.exports = app;
