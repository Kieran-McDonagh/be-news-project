const {
  selectArticleById,
  selectAllArticles,
  addsCommentByArticleId,
} = require("../models/articles.model");
const {
  checkCommentData,
  checkArticleIdExists,
} = require("../models/model-utils");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  const { username } = newComment;
  checkArticleIdExists(article_id)
    .then(() => {
     return checkCommentData(username).then(() => {
       return addsCommentByArticleId(article_id, newComment).then((addedComment) => {
          res.status(201).send({ addedComment });
        });
      });
    })
    .catch(next);
};
