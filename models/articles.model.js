const db = require("../db/connection");
const format = require("pg-format");
const { checkTopicExists } = require("./model-utils");

exports.selectArticleById = (id) => {
  const selectArticle = () => {
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1
    `, [id]
    )
  }
  const selectCommentCount = () => {
    return db.query(`
    SELECT COUNT (*) AS comment_count FROM comments
    WHERE article_id = $1
    `, [id]
    )
  }
  const promises = [selectArticle(), selectCommentCount()]
  return Promise.all(promises).then(([articleResult, commentResult]) => {
    if (articleResult.rows.length === 0) {
      return Promise.reject({status: 404, msg: 'Not found'})
    }
      const {comment_count} = commentResult.rows[0]
      const article = articleResult.rows[0]
      article.comment_count = comment_count
      return article
  })
};

exports.selectAllArticles = async (
  topic,
  sort_by = "created_at",
  order = "desc"
) => {
  const acceptedOrderBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const acceptedOrder = ["asc", "desc"];

  if (!acceptedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!acceptedOrderBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let baseString = `
  SELECT 
  articles.author,
  articles.title,
  articles.article_id,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id `;

  if (topic) {
    try {
      await checkTopicExists(topic);
      baseString += `WHERE articles.topic = '${topic}'`;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  baseString += `
  GROUP BY 
  articles.author,
  articles.title,
  articles.article_id,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url
  ORDER BY ${sort_by} ${order} `;

  return db.query(baseString).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
  const text = `UPDATE articles SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`;

  const values = [inc_votes, article_id];
  return db.query(text, values).then(({ rows }) => {
    return rows[0];
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
