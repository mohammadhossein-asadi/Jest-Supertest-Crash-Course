const express = require("express");

const router = express.Router();
const bookData = require("../data/books.json");
const { check, validationResult } = require("express-validator");
const { save } = require("../services/save.services");

router.get("/", (req, res) => {
  res.json(bookData);
});

router.post(
  "/",
  [
    check("name", "Book name is required").not().isEmpty(),
    check("author", "Author name is required").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, author } = req.body;

    bookData.push({
      name,
      author,
      id: Math.random(),
    });

    const isSaved = save(bookData);

    if (!isSaved) {
      return res.status(500).json({
        error: true,
        message: "Could not save book",
      });
    }

    res.status({
      message: "Success",
    });
  }
);

module.exports = router;
