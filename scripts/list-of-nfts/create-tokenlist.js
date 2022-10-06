// Script to create a new token list table

const { createTokenListTable } = require("./db-utils-2");

const prompt = require("prompt");

prompt.start();

console.log("Enter the title of the new Token List Table below.");

prompt.get(["tableName"], (error, result) => {
    if (error) return console.error(error.message);
    await createTokenListTable (result.tableName);
});
