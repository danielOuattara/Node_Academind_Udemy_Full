// const fs = require("fs");
// const express = require("express");

// const app = express();

// app.get("/", (req, res, next) => {
//   fs.readFile("my-page.html", "utf8", (err, data) => {
//     res.send(data);
//   });
// });

// app.listen(3000, () => console.log(`app is running on http://localhost:3000/`));

//-------------------------------------------------------------------------
//

// const fs = require("fs");
// const express = require("express");
// const handler = require("./response-handler");

// const app = express();

// app.get("/", handler);

// app.listen(3000, () => console.log(`app is running on http://localhost:3000/`));

//-------------------------------------------------------------------------
//
/* add : "type":"module" in package.json */

import express from "express";
import handler from "./response-handler.js";

const app = express();

app.get("/", handler);

app.listen(3000, () => console.log(`app is running on http://localhost:3000/`));
