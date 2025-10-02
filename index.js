
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
//connect Open Library Covers API to webiste
//connect with database and send user input to databank for permenent storage
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post('/submit', async (req, res) =>{
  const ISBN_number_input = req.body["ISBN_input"];
  const ISBN_number_input_Conversion = Number(ISBN_number_input);
  console.log(ISBN_number_input_Conversion);
  try{
    res.render("index.ejs", {result : ISBN_number_input_Conversion});
    // res.redirect("/");
  }catch(err){
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});