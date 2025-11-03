
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
/**
 * add tme of date to note div and database
 * // current timestamp in milliseconds
let ts = Date.now();

let date_time = new Date(ts);
let date = date_time.getDate();
let month = date_time.getMonth() + 1;
let year = date_time.getFullYear();

// prints date & time in YYYY-MM-DD format
console.log(year + "-" + month + "-" + date);
 */
app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM book_information ORDER BY id ASC");
  libraryNotes = result.rows;
  //dislpay data to the site
  res.render("index.ejs", {
    noteList : libraryNotes,
  });
});

app.post('/add', async (req, res) =>{
  const bookNotes = req.body.note;
  const bookRating = req.body.selectedOption;
  const ISBN = req.body.ISBN_input;
  
  try{
    await db.query("INSERT INTO book_information (book_notes, book_rating, ISBN) VALUES ($1, $2, $3)", [bookNotes, bookRating, ISBN]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }

});

app.post("/edit", async (req, res) => {
  
  const updatedBookNoteID = req.body.updatedItemId;
  const updatedNotes = req.body.updatedNotes;
  try{
    await db.query("UPDATE book_information SET book_notes = ($1) WHERE id=$2", [updatedNotes, updatedBookNoteID]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  
  const deletedItem = req.body.deleteItemId;
  try{
    await db.query("DELETE FROM book_information WHERE id = $1", [deletedItem]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});