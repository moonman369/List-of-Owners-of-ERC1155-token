// Scripts for managing sqlite database, ownerlist.db

const sqlite = require("sqlite3").verbose();

// Function for creating new ownerlist table
async function createOwnerList(tableName) {
  //Creating database object for ownerlist.db
  const db = new sqlite.Database(
    "./database/ownerlist.db",
    sqlite.OPEN_READWRITE,
    (error) => {
      error
        ? console.error(error.message)
        : console.log("Connection successful");
    }
  );

  // Database.run() method for passing queries to the db
  // Creating a new table
  db.run(
    `CREATE TABLE ${tableName} (_tokenId VARCHAR(78) PRIMARY KEY NOT NULL, _owners JSON)`, // SQL command
    (error) => {
      // fallback
      error
        ? console.error(error.message)
        : console.log("Successfully created DB!!");
    }
  );

  db.close(); // To unload the database
}

// Function for inserting new record in a given table
async function insertData(_dbName, _tokenId, _owners) {
  const db = new sqlite.Database(
    "./database/ownerlist.db",
    sqlite.OPEN_READWRITE,
    (error) => {
      error
        ? console.error(error.message)
        : console.log("Connection successful");
    }
  );

  // SQL command template
  const insertCommand = `INSERT INTO ${_dbName} (_tokenId, _owners) VALUES (?, ?)`;

  db.run(
    insertCommand /* SQL command template */,
    [_tokenId, _owners] /* Args to be passed in place of `?` delimiters */,
    (error) => {
      error ? console.error(error.message) : console.log("New row added");
    }
  );

  db.close();
}

// FUnction for updating a record in a given table
async function updateData(_dbName, _tokenId, _updatedOwners) {
  const db = new sqlite.Database(
    "./database/ownerlist.db",
    sqlite.OPEN_READWRITE,
    (error) => {
      error
        ? console.error(error.message)
        : console.log("Connection successful");
    }
  );

  const updateCommand = `UPDATE ${_dbName} SET _owners = ? WHERE _tokenId = ?`;

  db.run(updateCommand, [_updatedOwners, _tokenId], (error) => {
    error ? console.error(error.message) : console.log("New row added");
  });

  db.close();
}

// Function to return ownerlist for a given `tokenId`
// Returns Promise: {[`ownerlist array`]}; Containing an array of owners
async function getOwnersList(_dbName, _tokenId) {
  // Returning Promise object
  return new Promise((resolve, reject) => {
    // Entire functionality encapsulated in a callback fn
    const db = new sqlite.Database(
      "./database/ownerlist.db",
      sqlite.OPEN_READWRITE,
      (error) => {
        error
          ? console.error(error.message)
          : console.log("Connection successful");
      }
    );
    const selectCommand = `SELECT _owners FROM ${_dbName} WHERE _tokenId = ?`;

    db.all(selectCommand, [_tokenId], (error, rows) => {
      if (error) return console.error(error.message);
      resolve(rows); // Resolving `rows` array in the returned Promise object
    });

    db.close();
  });
}

// Function to check if a record for a certain tokenId exists in a table
// Returns a Promise: {exists: True/False}
async function idRecordExists(_dbName, tokenId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database(
      "./database/ownerlist.db",
      sqlite.OPEN_READWRITE,
      (error) => {
        error
          ? console.error(error.message)
          : console.log("Connection successful");
      }
    );
    const selectCommand = `SELECT _tokenId FROM ${_dbName}`;

    db.all(selectCommand, [], (error, rows) => {
      if (error) return console.error(error.message);
      let check = false;
      rows.forEach((row) => {
        const { _tokenId } = row;
        if (_tokenId == tokenId) check = true;
      });
      resolve({ exists: check });
    });

    db.close();
  });
}

// Function to log to terminal, an entire table from a given database
async function logFullList(_dbName, _tableName) {
  const db = new sqlite.Database(
    `./database/${_dbName}.db`,
    sqlite.OPEN_READWRITE,
    (error) => {
      error
        ? console.error(error.message)
        : console.log("Connection successful");
    }
  );

  const select = `SELECT * FROM ${_tableName}`;

  db.all(select, [], (error, rows) => {
    if (error) return console.error(error.message);
    console.log(rows);
  });

  db.close();
}

// Function to pause execution for a set time period (in ms)
const sleep = (timeInMs) => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve({});
    }, timeInMs);
  });
};

// Function to modify ownerlist array by either adding or removing owners as required
async function modifyList(erc1155ContractInstance, ownerlist, from, to, id) {
  let owners = new Set(ownerlist); // stores owner addresses in a set to eliminate duplicates if any

  owners.add(to); // adding new owner `to` address to the list

  const { _hex } = await erc1155ContractInstance.balanceOf(from, id); // fetches balance of the `from` address (i.e previous owner)

  if (_hex === "0x00") owners.delete(from); // checks if the balance of an existing owner is zero and deletes the address if balance is zero

  return [...owners]; // returns an array with the elements of the `owners` set
}

// Exporting all the functions
module.exports = {
  createOwnerList,
  insertData,
  updateData,
  getOwnersList,
  idRecordExists,
  logFullList,
  sleep,
  modifyList,
};
