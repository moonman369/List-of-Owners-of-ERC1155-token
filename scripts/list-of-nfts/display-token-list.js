// Script to log a tokenlist table to the terminal

const { logFullList } = require("../list-of-owners/db-utils");
const prompt = require("prompt");

prompt.start();

const dbName = "tokenlist";

prompt.get(["tableName"], async function (err, result) {
  if (err) return onErr(err);
  await logFullList(dbName, result.tableName);
});

function onErr(err) {
  return console.log(err);
}
