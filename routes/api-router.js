const apiRouter = require("express").Router();
const articleRouter = require("./article-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const userRouter = require("./users-router");

apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);

module.exports = apiRouter;
