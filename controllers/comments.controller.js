const { removeCommentById } = require("../models/comments.model");
const { checkCommentIdExists } = require("../models/model-utils");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  const promises = [
    checkCommentIdExists(comment_id),
    removeCommentById(comment_id)
  ];
  Promise.all(promises)
    .then(() => {
        res.status(204).send();
    }).catch(next)
};
