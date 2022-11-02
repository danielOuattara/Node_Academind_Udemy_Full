/* Using Express Router
-------------------------*/

const express = require("express");
const app = express();
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoutes = require("./routes/error");

app.use(express.urlencoded({ extended: false }));

// filtering mechanism :  /admin
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

app.listen(5500, () => {
  console.log(`Server is running on http://localhost:5500`);
});

//-------------------------------------------------------------------
