/*
 *Backend for Power Hack
 *Author Eliyas Hossain
 */

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

//Connect with MongoDB

const uri = `mongodb+srv://${process.env.MY_USER}:${process.env.MY_PASSWORD}@cluster0.wu2yr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("DB Connected BRo");
  client.close();
});

app.get("/", (req, res) => {
  res.send("Hello! Power Hack Server is Running Smoothly");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
