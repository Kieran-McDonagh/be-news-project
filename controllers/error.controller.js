exports.handle400s = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle404s = (_, res) => {
  res.status(404).send({ msg: "Not found" });
};

exports.handleServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: err });
};
