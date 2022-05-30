const express = require("express");
const app = express();
const feedRoutes = require("./routes/feedRoute");

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT,PATCHC, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  next()
});

app.use("/api/v1/feed", feedRoutes);

app.listen(8080, () =>
  console.log(`App is running on port http://localhost:${8080}/`)
);
