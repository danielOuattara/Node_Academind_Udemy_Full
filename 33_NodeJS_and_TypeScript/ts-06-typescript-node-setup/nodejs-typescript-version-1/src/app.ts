import express from "express";

const app = express();

import todosRoutes from "./routes/todoRoutes";
import notFound from "./Errors/notFound";

app.use(express.json());

app.use("/api/v1", todosRoutes);

app.use("*", notFound);
app.listen(3000, () => console.log("app is running on http://localhost:3000"));
