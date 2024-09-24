// Get our dependencies
const express = require("express");
const app = express();
const mysql = require("mysql");
const util = require("util");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "movie",
});
pool.query = util.promisify(pool.query);

// Implement the movies API endpoint
app.get("/movies", async function (req, res) {
  try {
    const rows = await pool.query(
      "select m.title, m.release_date, m.score, r.name as reviewer, p.name as publication from movies m," +
        "reviewers r, publications p where r.publication_id=p.id and m.reviewer_id=r.id"
    );
    res.json(rows);
  } catch (err) {
    console.error("API Error:", err);
    res.staus(500).send({ msg: "Internal server error" });
  }
});

app.get("/reviewers", async function (req, res) {
  try {
    const rows = await pool.query(
      "select r.name, r.publication_id, r.avatar from reviewers r"
    );
    res.json(rows);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).send({ msg: "Internal server error" });
  }
});

app.get("/publications", async function (req, res) {
  try {
    const rows = await pool.query(
      "select r.name, r.publication_id, r.avatar from reviewers r"
    );
    res.json(rows);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).send({ msg: "Internal server error" });
  }
});

app.get("/pending", async function (req, res) {
  try {
    const rows = await pool.query(
      "select m.title, m.release, m.score, r.name as reviewer, p.name as publication" +
        "from movies m, movie_db.reviewers r, movie.publications p where" +
        "r.publication_id=p.id and m.reviewer_id=r.id and m.release_date>=2023-01-15"
    );
    res.json(rows);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).send({ msg: "Internal server error" });
  }
});

app.get("/", function (req, res) {
  res.status(200).send({ service_status: "Up" });
});

console.log("server listening through port: " + process.env.PORT);
app.listen(process.env.PORT || 3000);
module.exports = app;
