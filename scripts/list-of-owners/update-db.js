const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const { updateData, getOwnersList, idRecordExists } = require("./db-utils");
const { modifyList } = require("./list-owners");
const sqlite = require("sqlite3").verbose();

async function main() {
  const db = new sqlite.Database(
    "./database/ownerlist.db",
    sqlite.OPEN_READWRITE,
    (error) => {
      error
        ? console.error(error.message)
        : console.log("Connection successful");
    }
  );

  // db.run(
  //   `CREATE TABLE ownerlistdummy1(_tokenId VARCHAR(78) PRIMARY KEY NOT NULL, _owners JSON)`
  // );

  // const insert = `INSERT INTO ownerlistdummy1 (_tokenId, _owners) VALUES (?, ?)`;

  // db.run(
  //   insert,
  //   [
  //     "3",
  //     [
  //       "0x0000000000000000000000000000000000000000",
  //       "0x0000000000000000000000000000000000000000",
  //       "asgdua",
  //       "wueyhdsagdbzncixejekwds",
  //     ],
  //   ],
  //   (error) => {
  //     error ? console.error(error.message) : console.log("New row added");
  //   }
  // );

  // const update = `UPDATE ownerlistdummy1 SET _owners = ? WHERE _tokenId = ?`;

  // db.run(update, [["ajdsh", "rt"], 2], (error) => {
  //   error ? console.error(error.message) : console.log("Row updated");
  // });

  const select = `SELECT _owners FROM ownerlistdummy1 WHERE _tokenId = ?`;

  // db.all(select, [3], (error, rows) => {
  //   if (error) return console.error(error.message);
  //   rows.forEach((row) => {
  //     console.log(typeof row);
  //   });
  // });

  const dbName = "ownerlistdummy1";

  await updateData(dbName, 3, [
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "asgdua",
    "wueyhdsagdbzncixejekwds",
    "ayan",
    "ayan",
    "ayan",
  ]);

  let owner = await getOwnersList(dbName, 3);
  let { _owners } = owner[0];

  console.log(_owners.split(","));

  let check;

  db.all("SELECT _tokenId FROM ownerlistdummy1", [], (error, rows) => {
    let _tokenId;
    rows.forEach((row) => {
      ({ _tokenId } = row);
      console.log(typeof _tokenId);
      if (_tokenId == "3") check = true;
      // if
    });
  });

  let { exists } = await idRecordExists(dbName, BigNumber.from(3));
  if (exists) {
    owner = await getOwnersList(dbName, 3);
    ({ _owners } = owner[0]);
    const ownerlist = new Set(_owners.split(","));
    console.log(ownerlist);
  }

  db.close((error) => {
    error && console.error(error.message);
  });
}

main()
  .then(() => {
    process.exitCode = 1;
  })
  .catch((error) => {
    console.log(error);
  });
