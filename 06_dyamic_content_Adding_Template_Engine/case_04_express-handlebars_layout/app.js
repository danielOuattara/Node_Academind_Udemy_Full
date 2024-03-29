const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");

const app = express();

app.engine("hbs", engine({ layoutsDir: "./views/layouts", extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "404 Not Found" });
});

app.listen(5500, () => {
  console.log("App is running on http://localhost:5500/");
});
