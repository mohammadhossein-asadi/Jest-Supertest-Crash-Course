const express = require("express");
const request = require("supertest");
const bookRoute = require("../routes/books.routes");

const app = express();

app.use(express.json());

app.use("/api/books", bookRoute);

describe("Integration tests for the books API", () => {
  it("GET /api/books - success - get all the books", async () => {
    const { body, statusCode } = await request(app).get("/api/books");

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          author: expect.any(String),
        }),
      ])
    );
    expect(statusCode).toBe(200);
  });

  it("POST /api/post - faliure on invalid post body", async () => {
    const { body, statusCode } = await request(app).post("/api/books").send({
      name: "",
      author: "John Travolta",
    });

    console.log(body);

    expect(statusCode).toBe(400);
    expect(body).toEqual({
      errors: [
        {
          location: "body",
          msg: "Book name is required",
          param: "name",
          value: "",
        },
      ],
    });
  });

  it("POST /api/books - success", async () => {
    const { body, statusCode } = await request(app).post("/api/books").send({
      name: "Face off",
      author: "John Travolta",
    });

    expect(statusCode).toBe(200);
    expect(body).toEqual({
      message: "Success",
    });
  });

  it("PUT /api/books/bookid - faliure when book is not found", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/books/5000")
      .send({
        name: "Love me like you do",
        author: "John Travolta",
      });

    expect(statusCode).toBe(404);

    expect(body).toEqual({
      error: true,
      message: "Book not found",
    });
  });
});
