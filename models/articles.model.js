const db = require("../db/connection");
const format = require("pg-format");

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

exports.selectArticleCommentsById = (article_id) => {
  return db
    .query(
      `
    SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY comments.created_at desc;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addsCommentByArticleId = (article_id, newComment) => {
  const { username, body } = newComment;
  const commentToAdd = [[body, article_id, username]];
  const commentToInsert = format(
    `
        INSERT INTO comments
        (body, article_id, author)
        VALUES
        %L
        RETURNING*;
        `,
    commentToAdd
  );
  return db.query(commentToInsert).then(({ rows }) => {
    return rows[0];
  });
};
