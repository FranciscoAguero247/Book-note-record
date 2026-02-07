
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const { Pool } = require('pg');
import axios from "axios";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;


const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for most cloud database providers
  }
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
  const limit = 6;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const totalResult = await db.query("SELECT COUNT(*) FROM book_information");
    const totalBooks = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalBooks / limit);
    const avgRes = await db.query("SELECT ROUND(AVG(book_rating), 1) as avg FROM book_information");
    const lastUpdateRes = await db.query("SELECT MAX(date_created) as last_date FROM book_information");
    const lastUpdate = lastUpdateRes.rows[0].last_date;

    const result = await db.query(
      "SELECT * FROM book_information ORDER BY id DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

   res.render("index.ejs", {
      noteList: result.rows,
      currentPage: page,
      totalPages: totalPages,
      averageRating: avgRes.rows[0].avg || 0,
      lastUpdated: lastUpdate // Pass this to the frontend
    });
  } catch (err) {
    console.error(err);
    res.render("index.ejs", { noteList: [], currentPage: 1, totalPages: 1 });
  }
});

app.post('/add', async (req, res) => {
  const { book_note, selectedOption, ISBN_input } = req.body;
  
  try {
    // 1. Fetch ISBN data
    const isbnRes = await axios.get(`https://openlibrary.org/isbn/${ISBN_input}.json`);
    const data = isbnRes.data;
    
    const bookTitle = data.title || "Unknown Title";
    
    // 2. Fetch Author Name (Authors are stored as an array of keys)
    let authorName = "Unknown Author";
    if (data.authors && data.authors.length > 0) {
      const authorKey = data.authors[0].key; // e.g., /authors/OL26320A
      const authorRes = await axios.get(`https://openlibrary.org/authors/${authorKey.split('/').pop()}.json`);
      authorName = authorRes.data.name;
    }

    await db.query(
      "INSERT INTO book_information (book_notes, book_rating, book_title, isbn, author) VALUES ($1, $2, $3, $4, $5)",
      [book_note, selectedOption, bookTitle, ISBN_input, authorName]
    );
    
    res.redirect("/");
  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).send("Error retrieving book data.");
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

app.get("/search", async (req, res) => {
  const searchTerm = req.query.q;

  try {
    // The % symbols allow for partial matching
    const result = await db.query(
      "SELECT * FROM book_information WHERE book_title ILIKE $1 OR author ILIKE $1 ORDER BY id DESC",
      [`%${searchTerm}%`]
    );

    res.render("index.ejs", { 
        noteList: result.rows,
        searchQuery: searchTerm // Pass this back so the user knows what they searched for
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
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
  const choice = req.body.drop_sort_down_menu;
  const page = 1; // Reset to page 1 when sorting
  const limit = 6;
  
  let query = "SELECT * FROM book_information";
  if (choice === "highest-rating") query += " ORDER BY book_rating DESC";
  else if (choice === "lowest-rating") query += " ORDER BY book_rating ASC";
  else query += " ORDER BY id DESC";

  try {
    const totalResult = await db.query("SELECT COUNT(*) FROM book_information");
    const totalPages = Math.ceil(parseInt(totalResult.rows[0].count) / limit);
    
    const result = await db.query(query + " LIMIT $1", [limit]);

    res.render("index.ejs", { 
      noteList: result.rows,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (err) {
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});