const { MongoClient } = require("mongodb");
const connectionString = 'mongodb+srv://rcadmin:ReqCheck0@reqcheckcluster.fsgtm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db;//.db('gameList');
      console.log("Successfully connected to MongoDB.");

      return dbConnection;
    });
  },

  getDb: function () {
    return dbConnection;
  },
};