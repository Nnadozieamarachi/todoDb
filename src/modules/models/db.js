const { MongoClient } = require("mongodb");

const connectToDb = async () => {
  try {
    const dbURI = "mongodb://localhost:27017/";

    const client = await MongoClient.connect(dbURI);

    return client.db("todoapi");
  } catch (error) {
    console.log(error, "database Error");
  }
};

module.exports = {
  connectToDb,
};
