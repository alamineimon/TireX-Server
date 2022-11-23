const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//mmiddle wares
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.juguzvf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log(uri);


async function run() {
  try {
    const productCollection = client.db("tirex").collection("services");

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
