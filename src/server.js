const server = require("express");
// const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const PORT = 3002;
const router = require("./modules/router");
const cors = require("cors");
const appRouters = require("./modules/router");
const app = server();

async function main() {
  app.use(cors());

  // app.set("view engine", "ejs");
  app.use(server.json());

  // app.use("/", router);

  // setup default mongodb connection
  const dbURI = "mongodb://localhost:27017/todoapi";
  const client = new MongoClient(dbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    retryWrites: true, //to retry info sent to db if not sent
  });

  await client.connect();

  const dbConnection = client.db("todoapi");

  app.locals.dbConnection = dbConnection;

  console.log("connected to the database");

  appRouters(app);

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
  // let dbConnection;
  // const dbURI = "mongodb://localhost:27017/todoapi";

  // function connectToDb() {
  //   return MongoClient.connect(dbURI)
  //     .then((client) => {
  //       dbConnection = client.db();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
  // function getDb() {
  //   return dbConnection;
  // }

  // let db;
  // console.log(typeof connectToDb());
  // connectToDb((err) => {
  //   if (!err) {
  //     app.listen(3002, () => {
  //       console.log("listening on port 3002");
  //     });
  //     db = getDb();
  //   }
  // });

  // module.exports = { connectToDb, getDb };
}

main()
  .then()
  .catch((error) => console.log(error));
