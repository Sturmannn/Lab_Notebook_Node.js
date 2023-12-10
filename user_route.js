const Router = require("express").Router;
const path = require("path")
const user_controller = require("./user_controller");
const router = new Router();
const db = require("./db")

// router.get("/findNote", user_controller.findNote)
// router.post("/writeNote", user_controller.writeNote)
// router.put("/updateNote", user_controller.updateNote)
// router.delete("/deleteNote/:id", user_controller.deleteNote)

router.get("/", (req, res) =>
{
    res.render(path.resolve(__dirname, "views", "index.ejs"))
})

router.post("/addNote", (req, res) =>
{
    const {content} = req.body;
    // console.log(req.body);
    db.query(`INSERT INTO Notes (content) VALUES ($1)`, [content])
})

router.get("/search", (req, res) =>
{
    res.render(path.resolve(__dirname, "views", "search.ejs"))
})

router.post("/search", (req, res) =>
{
    console.log(req.body)
    res.json("ok")
})

module.exports = router;