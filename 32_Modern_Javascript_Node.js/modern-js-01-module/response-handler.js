// 1

// const fs = require("fs");

// const handler = (req, res, next) => {
//   fs.readFile("my-page.html", "utf8", (err, data) => {
//     res.send(data);
//   });
// };

// module.exports = handler;

//-------------------------------------------------------------

// 2

// import { readFile } from "fs";

// const handler = (req, res, next) => {
//   readFile("my-page.html", "utf8", (err, data) => {
//     res.send(data);
//   });
// };

// export default handler;
//-------------------------------------------------------------

import { readFile } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const handler = (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  res.sendFile(path.join(__dirname, "./my-page.html"));
};

export default handler;
