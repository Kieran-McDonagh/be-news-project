const db = require("../db/connection");

exports.selectArticleById = (id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1;
    `,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      const article = rows[0];
      return article;
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
ORDER BY articles.created_at desc;
  `
    )
    .then(({ rows }) => {
      return rows
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  let text = ``
  if (inc_votes >= 0) {
    text = `UPDATE articles SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`
  } 
  if (inc_votes < 0) {
    inc_votes -= inc_votes * 2
    text = `UPDATE articles SET votes = votes - $1
    WHERE article_id = $2
    RETURNING *;`
  }
const values = [inc_votes, article_id];
return db.query(text, values).then(({ rows }) => {
  
  if (rows.length === 0) {
   return Promise.reject({status: 400, msg: 'Bad request'})
  }
  return rows[0];
});
}