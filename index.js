const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require('cors');
const app = express();
//use express.json() to get data into json format
app.use(express.json());
app.use(cors());

//port
const PORT = process.env.PORT || 5500;

// lets import routers

const authRoute = require("./routes/auth");
//lets connect to mongoose..
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.use("/", authRoute);
//Add Port and connect to server
app.listen(PORT, () => {
  console.log("Server connected");
});
