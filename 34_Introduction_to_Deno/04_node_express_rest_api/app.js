const express = require("express");
const todosRoutes = require("./routes/todoRoutes");
const notFound = require("./Errors/notFound");

const app = express();

app.use(express.json());

app.use("/api/v1", todosRoutes);

app.use("*", notFound);
app.listen(3000, () => console.log("app is running on http://localhost:3000"));
