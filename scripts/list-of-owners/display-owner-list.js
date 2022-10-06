// Script to display ownerlist table

const { logFullList } = require("./db-utils");
const prompt = require("prompt");

prompt.start();

const dbName = "ownerlist";

console.log("Enter the title of the DB to be querried, below.");

prompt.get(["tableName"], async function (err, result) {
  if (err) {
    return onErr(err);
  }
  await logFullList(dbName, result.tableName);
});

function onErr(err) {
  console.log(err);
  return 1;
}
