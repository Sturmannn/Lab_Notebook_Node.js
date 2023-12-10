const db = require("./db")

class UserNotes {
  async findNote(req, res) {}

  async writeNote(req, res) {
    const {content} = req.body;
    const newNote = await db.query(`INSERT INTO my_db (content) values ($1) RETURNING *`, [content])
    console.log(content)
    // res.json("ok")
    // res.json(newNote)
  }

  async updateNote(req, res) {}

  async deleteNote(req, res) {}
}

module.exports = new UserNotes()