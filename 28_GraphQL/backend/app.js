require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const cors = require("cors");
const authentication = require("./middlewares/authentication");
const multer = require("./middlewares/multer-config");
const clearFile = require("./utilities/clearFile");
//-----------------------------------

app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

const corsOptions = {
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(authentication);

app.put("/post-image", multer, (req, res, next) => {
  if (!req.isAuthenticated) {
    const error = new Error("User Not Authenticated");
    error.code = 401;
    next(error);
  }
  if (!req.file) {
    return res.status(200).json({ message: "No file provided !" });
  }
  if (req.body.oldPath) {
    clearFile(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: "File stored", filePath: req.file.path });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(error) {
      if (!error.originalError) {
        return error;
      } else {
        // const source = error.source;
        const data = error.originalError.data;
        // const message = error.originalError.message;
        const code = error.originalError.code;
        return { error, status: code, data };
      }
    },
  }),
);

// serving images statiscally
app.use("/images", express.static(path.join(__dirname, "images")));

//------------------------------------
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

//------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      `Connected to MongoDB Database ${process.env.MONGO_DATABASE}: success !`,
    );
    app.listen(8080, () =>
      console.log(`App is running on port http://localhost:${8080}/graphql`),
    );
  })
  .catch((err) => console.log(err));
