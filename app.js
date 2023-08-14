const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { handle400s } = require("./controllers/error.controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.use(handle400s);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: err });
});

module.exports = app;
