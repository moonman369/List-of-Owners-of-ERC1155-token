// Script to delete `ALL` records from a given table in a given database

const sqlite = require("sqlite3").verbose();
const prompt = require("prompt");

prompt.start();

prompt.get(["dbName", "tableName"], async function (err, result) {
  // Getting dbName and tableName from the node.js terminal
  if (err) return console.log(err.message);

  const db = new sqlite.Database(
    `database/${result.dbName}.db`,
    sqlite.OPEN_READWRITE,
    (error) => {
      error
        ? console.error(error.message)
        : console.log(`Successfully connected to ${result.dbName}.db`);
    }
  );
  const deleteCommand = `DELETE FROM ${result.tableName}`; // SQL command for `Delete`

  db.run(deleteCommand, [], (error) => {
    error
      ? console.error(error.message)
      : console.log(`All records deleted from ${result.tableName}`);
  });
});
