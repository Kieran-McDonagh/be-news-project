const { selectArticleById, selectAllArticles, updateArticleById } = require("../models/articles.model");
const { checkArticleIdExists } = require("../models/model-utils");

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

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    checkArticleIdExists(article_id).then(() => {
      return updateArticleById(article_id, inc_votes).then((updatedArticle) => {
    res.status(201).send({updatedArticle})
  })
    })
  .catch(next)
}
