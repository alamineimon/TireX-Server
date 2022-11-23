const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//mmiddle wares
app.use(cors());
app.use(express.json());




app.get("/", (res, req) => {
  req.send("TireX server is running");
});

app.listen(port, () => {
  console.log(`TireX Server running on port: ${port}`);
});
