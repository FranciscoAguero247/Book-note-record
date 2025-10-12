
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book notes",
  password: "postgres",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let libraryNotes =[];

//connect Open Library Covers API to webiste
//connect with database and send user input to databank for permenent storage
app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM book_information ORDER BY id ASC");
  libraryNotes = result.rows;
  //dislpay data to the site
  res.render("index.ejs", {
    noteList : libraryNotes,
  });
});

app.post('/submit', async (req, res) =>{
  const bookNotes = req.body.note;
  const bookRating = req.body.rate_number;
  const ISBN = req.body.ISBN_input;
  /**add limitation to rating number up to 10 or 5 */
  // if(bookRating >= 10){
  //   console.log("rating must be less than or eqaul to 10");
  // }
  
  try{
    await db.query("INSERT INTO book_information (book_notes, book_rating, ISBN) VALUES ($1, $2, $3)", [bookNotes, bookRating, ISBN]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});