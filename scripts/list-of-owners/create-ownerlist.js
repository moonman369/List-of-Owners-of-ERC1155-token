// Script to create a new table in the ownerlist.db database

const { createOwnerList } = require("./db-utils");
const prompt = require("prompt");

prompt.start();

console.log("Enter the title of the new Owner List Table below.");

// Using `prompt` to get user input from terminal
prompt.get(["name"], async function (err, result) {
  if (err) return console.error(err.message);

  // Function imported from db-utils.js
  await createOwnerList(result.name);
});
