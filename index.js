const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRET);
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

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }
  const token = authHeader.split(" ")[1];
  // console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send("Forbidden access");
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const productCollection = client.db("tirex").collection("services");
    const usersCollection = client.db("tirex").collection("users");
    const bookingsCollection = client.db("tirex").collection("bokkings");
    const paymentsCollection = client.db("tirex").collection("payment");

    //for get all service
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    // Add a service
    app.post("/myservices", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    // get all products by email88888888888888888888888888888888888888888888888888888888888
    app.get("/myservices", async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const products = await productCollection.find(query).toArray();
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
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
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



    //for payment
    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.findOne(query);
      res.send(result);
    });

    // FOR PAYMENT Server
    app.post("/create-payment-intent", async (req, res) => {
      const booking = req.body;
      const price = booking.resale_price;
      const amount = price * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        currency: "USD",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    
    // payment info saVE
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      console.log(req.body);
      const result = await paymentsCollection.insertOne(payment);
      const id = payment.bookingId;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      };
      const updateResult = await bookingsCollection.updateOne(
        filter,
        updatedDoc
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", ( req, res) => {
  res.send("TireX server is running");
});

app.listen(port, () => {
  console.log(`TireX Server running on port: ${port}`);
});
