require("dotenv").config();
const express = require("express");
const app = express();
const feedRoutes = require("./routes/feedRoute");
const authRoutes = require("./routes/authRoute");
const mongoose = require("mongoose");
const path = require("path");

//-----------------------------------
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT,PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  next();
});

app.use((req, res, next) => {
  next();
});

// serving images statiscally
app.use("/images", express.static(path.join(__dirname, "images")));

//-----------------------------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/feed", feedRoutes);

//------------------------------------
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

//------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Database: success !");
    app.listen(8080, () =>
      console.log(`App is running on port http://localhost:${8080}/`)
    );
  })
  .catch((err) => console.log(err));
