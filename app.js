const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {patchArticleById,
  getArticleById,
  getAllArticles,
  getArticleCommentsById,
  postCommentByArticleId
} = require("./controllers/articles.controller");
const {
  handle400s,
  handleCustomErrors,
} = require("./controllers/error.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getAllUsers } = require("./controllers/users.controller");
const app = express();

app.use(express.json())

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.get('/api/users', getAllUsers)

app.patch('/api/articles/:article_id', patchArticleById)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.delete('/api/comments/:comment_id', deleteCommentById)

app.use((_, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handle400s);

app.use(handleCustomErrors);

app.use((err, req, res, next) => {
    console.log(err);
  res.status(500).send({ msg: err });
});

module.exports = app;
