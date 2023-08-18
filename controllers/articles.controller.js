const {
  selectArticleById,
  selectAllArticles,
  addsCommentByArticleId,
  selectArticleCommentsById,
  updateArticleById
} = require("../models/articles.model");
const {
  checkCommentData,
  checkArticleIdExists
} = require("../models/model-utils");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const {topic, sort_by, order} = req.query
    return selectAllArticles(topic, sort_by, order).then((articles) => {
       res.status(200).send({ articles });
  }).catch(next)
  }
    

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  const promises = [
    checkArticleIdExists(article_id),
    updateArticleById(article_id, inc_votes),
  ];
  Promise.all(promises)
    .then(([_, updatedArticle]) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  const { username } = newComment;
  checkArticleIdExists(article_id)
    .then(() => {
      return checkCommentData(username).then(() => {
        return addsCommentByArticleId(article_id, newComment).then(
          (addedComment) => {
            res.status(201).send({ addedComment });
          }
        );
      });
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
