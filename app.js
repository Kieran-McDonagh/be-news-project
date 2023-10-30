const express = require("express");
const cors = require("cors");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  handle400s,
  handleCustomErrors,
  handle404s,
  handleServerError,
} = require("./controllers/error.controller");
const apiRouter = require("./routes/api-router");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.get("/api", getEndpoints);

app.use(handle404s);
app.use(handle400s);
app.use(handleCustomErrors);
app.use(handleServerError);

module.exports = app;
