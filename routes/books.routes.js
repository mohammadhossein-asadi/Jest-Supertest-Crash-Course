const express = require("express");

const router = express.Router();
const bookData = require("../data/books.json");

router.get("/", (req, res) => {
  res.json(bookData);
});

module.exports = router;
