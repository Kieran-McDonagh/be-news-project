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
  test('200: should also return article objects with no comments', () => {
    return request(app).get('/api/articles')
    .expect(200)
    .then(({body}) => {
    const {articles} = body
        const articlesWithNoComments = articles.filter((article) => {
            return article.comment_count === '0'
        })
        articlesWithNoComments.forEach((article) => {
            expect(articles).toContain(article)
        })
    })
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



describe('POST /api/articles/:article_id/comments', () => {
    test('201: should add a comment for an article. responds with the posted comment', () => {
        const testComment = {
            username: 'test user',
            body: 'test body'
        }
        return request(app).post('/api/articles/1/comments')
        .send(testComment)
        .expect(201)
        .then(({body}) => {
            const {addedComment} = body
            expect(addedComment).toHaveProperty('username', 'test user')
            expect(addedComment).toHaveProperty('body', 'test body')
        })
    });
});