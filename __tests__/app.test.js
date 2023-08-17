const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: should respond with a status code of 200 and an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET /api", () => {
  test("200: should return an object describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        for (const key in endpoints) {
          if (
            endpoints.hasOwnProperty(key) &&
            endpoints[key] !== endpoints["GET /api"]
          ) {
            expect(endpoints[key]).toHaveProperty("description");
            expect(endpoints[key]).toHaveProperty("queries");
            expect(endpoints[key]).toHaveProperty("exampleResponse");
          }
        }
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: should respond with an article object with all relevant properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("400: should return bad request if given an invalid article id", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should return 404 not found if given valid id but no data", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: should return a sorted articles array of article objects, without body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: should also return article objects with no comments", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const articlesWithNoComments = articles.filter((article) => {
          return article.comment_count === "0";
        });
        articlesWithNoComments.forEach((article) => {
          expect(articles).toContain(article);
        });
      });
  });
});

describe("ALL /notapath", () => {
  test("404: should respond with a custom 404 message if the path is not found", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should return an array of comments for the given article id, with most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
      });
  });
  test("200: should return an empty array if the id is valid and the article exists but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("400: should return bad request if given an invalid article id", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should return 404 not found if given valid id but article does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should add a comment for an article. responds with the posted comment", () => {
    const testComment = {
      username: "butter_bridge",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        const { addedComment } = body;
        expect(addedComment).toHaveProperty("comment_id", expect.any(Number));
        expect(addedComment).toHaveProperty("body", "test body");
        expect(addedComment).toHaveProperty("article_id", 1);
        expect(addedComment).toHaveProperty("author", "butter_bridge");
        expect(addedComment).toHaveProperty("votes", 0);
        expect(addedComment).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("400: should return 400 bad request if given invalid data", () => {
    const testComment = {
      username: 9999,
      body: "test body",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should return 400 bad request if given an invalid ID", () => {
    const testComment = {
      username: "butter_bridge",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/hello/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
test("404: should return Not found if given a valid ID but ID does not exist", () => {
  const testComment = {
    username: "butter_bridge",
    body: "test body",
  };
  return request(app)
    .post("/api/articles/9999/comments")
    .send(testComment)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not found");
    });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: should update votes by article_id, when given positive number", () => {
    const testPatch = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle.votes).toBe(101);
      });
  });
  test("200: should update votes by article_id, when given negative number", () => {
    const testPatch = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle.votes).toBe(0);
      });
  });
  test("400: should return bad request if given invalid data", () => {
    const testPatch = { inc_votes: "banana" };
    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should return bad request if given an invalid article id", () => {
    const testPatch = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/banana")
      .send(testPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should return 404 not found if given valid id but no data", () => {
    const testPatch = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/9999")
      .send(testPatch)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should respond with a status 204 and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("204: deleted comment should be removed from database", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db.query(
          `
      SELECT * FROM comments WHERE comment_id = $1;
      `,
          [1]
        );
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
        expect(rows).toEqual([]);
      });
  });
  test("400: should return 400 bad request if comment_id is not valid", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should return 404 not found if comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with: an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe('GET /api/articles (queries)', () => {
 describe('sorting articles by topics', () => {
    test('200: filters the articles by the topic value', () => {
      return request(app).get('/api/articles?topic=mitch')
      .expect(200)
      .then(({body}) => {
        const {articles} = body
        articles.forEach(article => {
          expect(article.topic).toBe('mitch')
          expect(article.topic).not.toBe('cats')
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).not.toHaveProperty("body");
        })
      })
    });
    test('404: should respond with Not found if no topics match query', () => {
      return request(app).get('/api/articles?topic=banana')
      .expect(404)
      .then(({body}) => {
       expect(body.msg).toBe('Not found')
      })
    });
    describe('sorts articles by query', () => {
      test('should sort the articles by any valid column', () => {
        return request(app).get('/api/articles?sort_by=article_id')
        .expect(200)
        .then(({body}) => {
          const {articles} = body
          expect(articles).toBeSortedBy('article_id', {descending: true})
        })
      });
      test('400: should return bad request if given a query that does not exist', () => {
        return request(app).get('/api/articles?sort_by=banana')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request')
        })
      });
    });
    describe('sorts articles by ascending or descending', () => {
      test('200: should sort the articles by either ascending or descending values', () => {
        return request(app).get('/api/articles?order=asc')
        .expect(200)
        .then(({body}) => {
          const {articles} = body
          expect(articles).toBeSortedBy('created_at', {ascending: true})
        })
      });
      test('400: should return bad request if given a query that does not exist', () => {
        return request(app).get('/api/articles?order=banana')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request')
        })
      });
    });
    describe('multiple queries', () => {
      test('200: should return an array of correctly formatted objects when given multiple queries ', () => {
        return request(app).get('/api/articles?topic=mitch&sort_by=article_id&order=asc')
        .expect(200)
        .then(({body}) => {
          const {articles} = body
          expect(articles).toBeSortedBy('article_id',{ascending: true})
          articles.forEach(article => {
            expect(article.topic).toBe('mitch')
            expect(article.topic).not.toBe('cats')
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty("article_img_url", expect.any(String));
            expect(article).toHaveProperty("comment_count", expect.any(String));
            expect(article).not.toHaveProperty("body");
          })
        })
      });
    });
 });
})



