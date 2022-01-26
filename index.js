const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
// const fileUpload=require('express-fileupload');
const admin = require("firebase-admin");

//defualt port
const port = process.env.PORT || 7000;
//middlewares
app.use(cors());
app.use(express.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
    const userExperincecollection = database.collection("experience");
    const userCollection = database.collection("users");

    //apis
    //getting all apartments
    app.get("/alltours", async (req, res) => {
      const cursor = tripsCollection.find({});
      const alltrips = await cursor.toArray();
      res.json(alltrips);
    });

    ///getting admins database
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    //adding user data to databse
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    ///adding already exists users  data to database
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      console.log(result);
      res.json(result);
    });
  } finally {
    ///do something
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome to Travel mania ........!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
