const {
  selectArticleById,
  selectAllArticles,
  selectArticleCommentsById,
  checkArticleIdExists,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  checkArticleIdExists(article_id)
    .then(() => {
      selectArticleCommentsById(article_id).then((comments) => {
        res.status(200).send({ comments });
      });
    })
    .catch(next);
};
