const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
// const fileUpload=require('express-fileupload');
//  const admin = require("firebase-admin");

//defualt port
const port = process.env.PORT || 7000;
//middlewares
app.use(cors());
app.use(express.json());

//connection string in mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.byzxg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//connecting database
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    //making connection with database
    await client.connect();
    console.log("databse connection established");
    //creating databse and ollections
    const database = client.db("TravelMania");
    const tripsCollection = database.collection("trips");
    const BlogSCollection = database.collection("BlogSCollection");
    const userExperince = database.collection("experience");
    const users = database.collection("users");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome to Travel mania!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
