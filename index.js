const express = require("express");
const path = require("path")
const userRouter = require("./user_route")
const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');

const app = express();

const PORT = 3000;

// app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
// app.use("/api", userRouter);
app.use(userRouter);
// app.use("/", userRouter)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`)
});
