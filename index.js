
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
//add tme of date to note div and database
//conncet app.post to drop down menu in client side
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

  //add book title to the book_informatiion table under book_title colum
  //get title from json file at openlibrary.org and send it to database

  const bookInfo = await axios.get(`https://openlibrary.org/isbn/${ISBN}.json`);
  const bookTitle = bookInfo.data.title;
  
  try{
    await db.query("INSERT INTO book_information (book_notes, book_rating, book_title, isbn, date_created) VALUES ($1, $2, $3, $4, NOW())", [bookNotes, bookRating, bookTitle, ISBN]);
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

app.post("/sort", async (req, res) => {

  const dropDownMenu = req.body.drop_sort_down_menu;

  if(dropDownMenu === "lowest-rating"){
    try{
      const result = await db.query("SELECT * FROM book_information ORDER BY book_rating ASC");
      libraryNotes = result.rows;
      res.render("index.ejs", {
        noteList : libraryNotes,
      });
    }catch(err){
      console.log(err);
    }
  }

  if(dropDownMenu === "highest-rating"){
    try{
      const result = await db.query("SELECT * FROM book_information ORDER BY book_rating DESC");
      libraryNotes = result.rows;
      res.render("index.ejs", {
        noteList : libraryNotes,
      });
    }catch(err){
      console.log(err);
    }
  }

  if(dropDownMenu === "recent"){ 
    try{
      const result = await db.query("SELECT id,book_notes, book_rating, isbn, date_created FROM book_information WHERE date_created = (SELECT MAX(date_created) FROM book_information);");
      libraryNotes = result.rows;
      res.render("index.ejs", {
        noteList : libraryNotes,
      });
    }catch(err){
      console.log(err);
    }
  }

  if(dropDownMenu === "oldest"){
    try{
      const result = await db.query("SELECT id,book_notes, book_rating, isbn, date_created FROM book_information WHERE date_created = (SELECT MIN(date_created) FROM book_information);");
      libraryNotes = result.rows;
      res.render("index.ejs", {
        noteList : libraryNotes,
      });
    }catch(err){
      console.log(err);
    }
  }
  
  // add title colomn to book_information table for ASC to work 
  // have title display on client side

  if(dropDownMenu === "title-sort"){
    try{
      await db.query("SELECT * FROM book_information ORDER BY book_title ASC");
      res.redirect("/");
    }catch(err){
      console.log(err);
    }
  }


});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});