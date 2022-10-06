// Script for managing sqlite database, tokenlist.db

const { ethers } = require("hardhat");

const sqlite = require("sqlite3").verbose();

// Function to create new tokenlist table
async function createTokenListTable(tableName) {
  const db = new sqlite.Database(
    "./database/tokenlist.db",
    sqlite.OPEN_READWRITE,
    (error) => {
      error
        ? console.error(error.message)
        : console.log("Successfully connected to tokenlist.db");
    }
  );

  const createCommand = `CREATE TABLE ${tableName} (_ownerAddress VARCHAR(45) PRIMARY KEY NOT NULL, _tokenList JSON)`;

  db.run(createCommand, (error) => {
    if (error) return console.error(error.message);
    console.log(`Successfully created table: ${tableName}`);
  });

  db.close();
}

// Funcion to create a new token list record for a new address in a given token list table
async function insertTokenList(tableName, ownerAddress, tokenListObject) {
  const db = new sqlite.Database(
    "./database/tokenlist.db",
    sqlite.OPEN_READWRITE,
    (error) => {
      error
        ? console.error(error.message)
        : console.log("Successfully connected to tokenlist.db");
    }
  );

  const insertCommand = `INSERT INTO ${tableName} (_ownerAddress, _tokenList) VALUES (?, ?)`;

  const tokenListString = globalThis.JSON.stringify(tokenListObject); // Flattening tokenlist object into string

  db.run(insertCommand, [ownerAddress, tokenListString], (error) => {
    error
      ? console.error(error.message)
      : console.log("New row added successfully!!!");
  });

  db.close();
}

// Function to update an existing record with a new or modified token list
async function updateTokenList(tableName, ownerAddress, tokenListObject) {
  const db = new sqlite.Database(
    "./database/tokenlist.db",
    sqlite.OPEN_READWRITE,
    (error) => {
      error
        ? console.error(error.message)
        : console.log("Successfully connected to tokenlist.db");
    }
  );

  const updateCommand = `UPDATE ${tableName} SET _tokenList = ? WHERE _ownerAddress = ?`;

  db.run(
    updateCommand,
    [globalThis.JSON.stringify(tokenListObject), ownerAddress],
    (error) => {
      error
        ? console.error(error.message)
        : console.log(`Successfully updated row!!!`);
    }
  );

  db.close();
}

// Function to return the record of a particular address
// Returns a Promise object containing the tokenlist array
async function getTokenList(tableName, ownerAddress) {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database(
      "./database/tokenlist.db",
      sqlite.OPEN_READWRITE,
      (error) => {
        error
          ? console.error(error.message)
          : console.log("Successfully connected to tokenlist.db");
      }
    );

    const selectCommand = `SELECT _tokenList FROM ${tableName} WHERE _ownerAddress = ?`;

    db.all(selectCommand, [ownerAddress], (error, rows) => {
      if (error) return console.error(error.message);
      const { _tokenList } = rows[0];
      resolve(globalThis.JSON.parse(_tokenList)); // Parsing the flattened JSON string into an object and returning it in a Promise object
    });
  });
}

// Function to check if a certain address' record exists in a table
// Returns a Promise object. {exists: true/false}
async function ownerRecordExists(tableName, ownerAddress) {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database(
      "./database/tokenlist.db",
      sqlite.OPEN_READWRITE,
      (error) => {
        error
          ? console.error(error.message)
          : console.log("Successfully connected to tokenlist.db");
      }
    );

    const selectCommand = `SELECT _ownerAddress FROM ${tableName}`;

    db.all(selectCommand, [], (error, rows) => {
      if (error) return console.error(error.message);
      let check = false;
      rows.forEach((row) => {
        const { _ownerAddress } = row;
        if (_ownerAddress == ownerAddress) check = true;
      });
      resolve({ exists: check });
    });
  });
}

module.exports = {
  createTokenListTable,
  insertTokenList,
  updateTokenList,
  getTokenList,
  ownerRecordExists,
};
