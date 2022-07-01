/*
 *Backend for Power Hack
 *Author Eliyas Hossain
 */

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { decode } = require("jsonwebtoken");
const port = process.env.PORT || 5000;
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

//Connect with MongoDB
const uri = `mongodb+srv://${process.env.MY_USER}:${process.env.MY_PASSWORD}@cluster0.6d2m8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
  try {
    await client.connect();

    const usersCollection = client.db("power-hack").collection("users_list");
    const billingsCollection = client
      .db("power-hack")
      .collection("billings_list");

    //Register User
    app.post("/registration", async (req, res) => {
      const data = req.body;
      const email = data.email;
      const userPass = data.password;
      const userName = data.name;
      const password = await bcrypt.hash(userPass, 10);
      const user = await usersCollection.find({}).toArray();
      let isUser;
      user.forEach((us) => {
        if (us.email === email) {
          return (isUser = true);
        } else {
          return (isUser = false);
        }
      });

      if (isUser) {
        console.log(isUser);
        res.send({ message: "User already Register" });
      } else {
        const newUser = { email, password, userName };
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    });

    //Get All Users
    app.get("/user", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    //Add a Billing to DB
    app.post("/api/add-billing", async (req, res) => {
      const bill = req.body;
      const result = await billingsCollection.insertOne(bill);
      return res.send(result);
    });
    //Get  Billing List from
    app.get("/api/billing-list", async (req, res) => {
      console.log("query", req.query);
      const page = parseInt(req.query.page);
      const query = {};
      const result = billingsCollection.find(query);
      let billingList = await result

        .skip(page * 10)
        .limit(10)
        .toArray();

      return res.send(billingList);
    });

    //Get Billing List for Pagination
    app.get("/api/billing-pagination", async (req, res) => {
      const query = {};
      const result = billingsCollection.find(query);
      const count = await result.count();
      res.send({ count });
    });
    //Update Billing Info
    app.put("/api/update-billing/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBill = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: updatedBill,
      };
      const result = await billingsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      result.acknowledged
        ? res
            .status(200)
            .send({ success: true, message: "data update successfully" })
        : res.status(500).send({
            success: false,
            error: "Sorry !There's Something Wrong in the Server",
          });
    });

    //Delete a Billing Info
    app.delete("/api/delete-billing/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await billingsCollection.deleteOne(query);
      result.acknowledged
        ? res
            .status(200)
            .send({ success: true, message: "Data deleted successfully" })
        : res.status(500).send({
            success: false,
            error: "Sorry !There's Something Wrong in the Server",
          });
    });
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello! Power Hack Server is Running Smoothly");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
