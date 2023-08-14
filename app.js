const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getAtricleById } = require("./controllers/articles.controller");
const { handle400s, handleCustomErrors } = require("./controllers/error.controller");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getAtricleById);

app.use(handle400s);

app.use(handleCustomErrors)

app.use((err, req, res, next) => {
  res.status(500).send({ msg: err });
});

module.exports = app;
