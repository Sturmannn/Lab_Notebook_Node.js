const Router = require("express").Router;
const path = require("path");
const router = new Router();
const db = require("./db");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/file_storage",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/addNote", upload.array("files"), async (req, res) => {
  const { note_titles, content, tags } = req.body;

  let fileNamesForDB = "";
  if (!req.files || req.files.length === 0) fileNamesForDB = null;
  else {
    for (let i = 0; i < req.files.length - 1; i++) {
      fileNamesForDB = fileNamesForDB + req.files[i].originalname + ";";
    }
    fileNamesForDB =
      fileNamesForDB + req.files[req.files.length - 1].originalname;
  }
  await db.query(
    `INSERT INTO Notes (title, content, tags, paths_to_files) VALUES ($1, $2, $3, $4)`,
    [note_titles, content, tags, fileNamesForDB],
    (error, result) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send(error.message);
      }
      res.redirect("/addNote");
    }
  );
});

router.get("/", async (req, res) => {
  res.render(path.resolve(__dirname, "views", "home.ejs"));
});

router.get("/addNote", async (req, res) => {
  res.render(path.resolve(__dirname, "views", "addNote.ejs"));
});

router.get("/search", async (req, res) => {
  const rowCount = 0;
  res.render(path.resolve(__dirname, "views", "search.ejs"), {
    rowCount,
  });
});

router.post("/search", async (req, res) => {
  const { searchType, text } = req.body;

  if (searchType == "title") {
    await db.query(
      `SELECT * FROM Notes WHERE title LIKE '${text}'`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            error:
              "Произошла ошибка во время поиска информации из базы данных!",
          });
          return console.error(err.message);
        }
        res.json({ rows: result.rows, rowCount: result.rowCount });
      }
    );
  } else if (searchType == "label") {
    await db.query(
      `SELECT * FROM Notes WHERE tags LIKE '%${text}%'`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            error:
              "Произошла ошибка во время поиска информации из базы данных!",
          });
          return console.error(err.message);
        }
        res.json({ rows: result.rows, rowCount: result.rowCount });
      }
    );
  } else {
    await db.query(
      `SELECT * FROM Notes WHERE content LIKE '%${text}%'`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            error:
              "Произошла ошибка во время поиска информации из базы данных!",
          });
          return console.error(err.message);
        }
        res.json({ rows: result.rows, rowCount: result.rowCount });
      }
    );
  }
});

module.exports = router;
