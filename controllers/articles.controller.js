const { selectArticleById, selectAllArticles, addsCommentByArticleId } = require("../models/articles.model");

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
    res.status(200).send({articles})
  })
}

exports.postCommentByArticleId = (req, res, next) => {
  const {article_id} = req.params
  const newComment = req.body
  addsCommentByArticleId(article_id, newComment).then((addedComment) => {
    res.status(201).send({addedComment})
  })
}

exports.checkCommentData = (newComment) => {
  return db.query(`
    SELECT * FROM users
    WHERE username = $1
  `, [newComment]).then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({status: 400, msg: 'Bad request'})
    }
  })
}