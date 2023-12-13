const Router = require("express").Router;
const path = require("path");
const user_controller = require("./user_controller");
const router = new Router();
const db = require("./db");
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // cb(null, path.resolve(__dirname, "file_storage")); // Путь для сохранения загруженных файлов
//     cb(null, "./file_storage"); // Путь для сохранения загруженных файлов
//   },
//   filename: (req, file, cb) => {
//     // Уникальное имя файла
//     //   cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     cb(null, file.originalname);
//   },
// });

const storage = multer.diskStorage({
  destination: "./public/file_storage",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
// const upload = multer({ storage: storage }).array('files', 5); // files из name

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

// Маршрут для обработки загрузки файла
// router.post("/addNote", upload.single("file"), async (req, res) => {
//   // Файл будет доступен в req.file
//   // console.log(req)
//   const { content, tags} = req.body;
//   const {originalname} = req.file;
//   const path_to_file_dir = path.resolve(__dirname);
//   console.log(req)
//   console.log(originalname)
//   await db.query(
//     `INSERT INTO Notes (content, tags, paths_to_files) VALUES ($1, $2, $3)`,
//     [content, tags, `${path_to_file_dir}/file_storage/${originalname}`],
//     (error, result) => {
//       if (error) {
//         console.error(error.message);
//         res.status(500).send(error.message);
//       }

//     //   res.json("Запись добавлена в базу данных!");
//       //   res.status(200).redirect("/addNote");
//     }
//   );
//   if (!req.file) {
//     return res.status(400).send("Ошибка: файл не был загружен");
//   }
//   // Выполнение каких-то действий с загруженным файлом

// //   res.send("Файл успешно загружен");
//   res.redirect("/addNote")
// });

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

// router.post("/addNote", async (req, res) => {
//   const { content, tags } = req.body;
//   console.log(req.body);
//   await db.query(
//     `INSERT INTO Notes (content, tags) VALUES ($1, $2)`,
//     [content, tags],
//     (error, result) => {
//       if (error) {
//         console.error(error.message);
//         res.send(error.message);
//       }

//     //   res.json("Запись добавлена в базу данных!");
//       res.status(200).redirect("/addNote");
//     }
//   );

//   try {
//     // const client = await pool.connect();
//     const result = await db.query(`INSERT INTO Notes (content) VALUES ($1, $2)`, [
//       content, tags
//     ], );
//     // res.json("Запись добавлена в базу данных!");
//     res.status(200).redirect("/addNote");
//     // res.redirect("/");
//     // client.release();
//   } catch (err) {
//     console.error("Произошла обшибка при записи в БД: ", err);
//     res
//       .status(500)
//       .json({ error: "Произошла ошибка при сохранении записи в базе данных!" });
//   }
// });

// router.post("/search", async (req, res) => {
//   console.log(req.body);
//   const { text } = req.body;
//   console.log("Текст = ", text);
//   try {
//     const result = await db.query(
//       `SELECT * FROM Notes WHERE (content) = ($1)`,
//       [text]
//     );
//     const { rowCount, rows } = result;
//     // console.log(result);
//     res.render("search", { rowCount, rows });
//     // res.status(200);
//   } catch (err) {
//     console.error(
//       "Произошла ошибка во время поиска информации из базы данных: ",
//       err
//     );
//     res
//       .status(500)
//       .json({
//         error: "Произошла ошибка во время поиска информации из базы данных!",
//       });
//   }

//   res.status(200).json({ msg: "ok" });
// });


router.post("/search", async (req, res) => {
  console.log("Здесь бади", req.body);
  const { searchType, text } = req.body;

  if (searchType == "title")
  {
    await db.query(
      `SELECT * FROM Notes WHERE title = '${text}'`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            error: "Произошла ошибка во время поиска информации из базы данных!",
          });
          return console.error(err.message);
        }
        console.log(result.rows);
        res.json({rows: result.rows, rowCount: result.rowCount})
        // res.render(path.resolve(__dirname, "views", "search.ejs"), {
        //   rowCount: result.rowCount,
        //   rows: result.rows,
        // });
        // res.status(200).json({ msg: "ok" });
      }
    );
  }
  else if (searchType == "label")
  {
    await db.query(
      `SELECT * FROM Notes WHERE tags LIKE '%${text}%'`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            error: "Произошла ошибка во время поиска информации из базы данных!",
          });
          return console.error(err.message);
        }
        console.log(result.rows);
        res.json({rows: result.rows, rowCount: result.rowCount})
      }
    );
  }

  else
  {
    await db.query(
      `SELECT * FROM Notes WHERE content LIKE '%${text}%'`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            error: "Произошла ошибка во время поиска информации из базы данных!",
          });
          return console.error(err.message);
        }
        console.log(result.rows);
        res.json({rows: result.rows, rowCount: result.rowCount})
      }
    );
  }





// router.post("/search", async (req, res) => {
//   console.log(req.body);
//   const { searchType, text } = req.body;

//   if (searchType == "title")
//   {
//     await db.query(
//       `SELECT * FROM Notes WHERE (title) = ($1)`,
//       [text],
//       (err, result) => {
//         if (err) {
//           res.status(500).json({
//             error: "Произошла ошибка во время поиска информации из базы данных!",
//           });
//           return console.error(err.message);
//         }
//         console.log(result);
//         res.render(path.resolve(__dirname, "views", "search.ejs"), {
//           rowCount: result.rowCount,
//           rows: result.rows,
//         });
//         res.status(200).json({ msg: "ok" });
//       }
//     );
//   }

  

  // await db.query(
  //   `SELECT * FROM Notes WHERE (content) = ($1)`,
  //   [text],
  //   (err, result) => {
  //     if (err) {
  //       res.status(500).json({
  //         error: "Произошла ошибка во время поиска информации из базы данных!",
  //       });
  //       return console.error(err.message);
  //     }
  //     console.log(result);
  //     //   const {rowCount, rows} = result;
  //     res.render(path.resolve(__dirname, "views", "search.ejs"), {
  //       rowCount: result.rowCount,
  //       rows: result.rows,
  //     });
  //     res.status(200).json({ msg: "ok" });
  //   }
  // );
});

module.exports = router;
