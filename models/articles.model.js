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
      return rows;
    });
};

exports.checkArticleIdExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.selectArticleCommentsById = (article_id) => {
  return db
    .query(
      `
    SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY comments.comment_id, comments.votes, comments.created_at, comments.author, comments.    body, comments.article_id
    ORDER BY comments.created_at desc;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows[0].comment_count === "0") {
        rows = [];
      }
      return rows;
    });
};
