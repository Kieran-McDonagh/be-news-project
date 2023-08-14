exports.handle400s = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err);
  } else next;
};
