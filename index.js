const express = require("express");
const path = require("path")
const userRouter = require("./user_route")
const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
// app.use("/api", userRouter);
// app.use(userRouter);
app.use("/", userRouter)

// app.get("/", (req, res) => {c
//   res.send("Hello, vse rabotaet");
// });

// const error_handler = (req, res) => {
//   res.send("Vizvan Error");
// };

// app.all("/a*a", (req, res, next) => {
//   res.send("Hello from a*a");
//   console.log("Hello from a*a"); // добавлено для демонстрации
//   next();
// }, error_handler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`)
});

