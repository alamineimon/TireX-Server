const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//mmiddle wares
app.use(cors());
app.use(express.json());

// mongodb set up
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.juguzvf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollection = client.db("tirex").collection("services");
    const usersCollection = client.db("tirex").collection("users");
    const bookingsCollection = client.db("tirex").collection("bokkings");

    //for get all service
    app.get("/services", async (req, res) => {
      const query = {};
      console.log(req.params);
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    

    //get data by kawasaki category
    app.get("/kawasaki", async (req, res) => {
      // const query = {}
      const products = await productCollection
        .find({ categoryName: "kawasaki" })
        .toArray();
      res.send(products);
    });
    //get data by ktm category
    app.get("/ktm", async (req, res) => {
      // const query = {}
      const products = await productCollection
        .find({ categoryName: "ktm" })
        .toArray();
      res.send(products);
    });
    //get data by yamaha category
    app.get("/yamaha", async (req, res) => {
      // const query = {}
      const products = await productCollection
        .find({ categoryName: "yamaha" })
        .toArray();
      res.send(products);
    });
    // post an user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    // get all user
    app.get("/users", async (req, res) => {
      const query = {}
      const users = await usersCollection.find(query).toArray()
      res.send(users)
    });
    //make admin a user
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };

      const options = { upsert: true };

      const updatedDoc = {
        $set: {
          type: "admin",
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    // post bokoking data
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    // get all products by email
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });
    // delete booking data by id
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await bookingsCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (res, req) => {
  req.send("TireX server is running");
});

app.listen(port, () => {
  console.log(`TireX Server running on port: ${port}`);
});
