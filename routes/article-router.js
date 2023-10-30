const {
  getArticles,
  getArticleById,
  getArticleCommentsById,
  postCommentByArticleId,
  patchArticleById,
} = require("../controllers/articles.controller");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles);

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);
articleRouter
  .route("/:article_id/comments")
  .get(getArticleCommentsById)
  .post(postCommentByArticleId);

module.exports = articleRouter;
