require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express');
const app = express();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB:", err));


