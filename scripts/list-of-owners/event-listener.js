// Script for listening to ccntract events in real time and updating the ownerlist db accordingly

const { ethers } = require("hardhat");

// Importing functions from db-utils.js
const {
  insertData,
  updateData,
  getOwnersList,
  idRecordExists,
  modifyList,
} = require("./db-utils");

// Importing the ABI array for the ERC1155 token contract from artifacts folder
const { abi } = require("../../artifacts/contracts/FireNFT.sol/FireNFT.json");

const zeroAddress = "0x0000000000000000000000000000000000000000";

async function main() {
  // Getting sample hardhat Signers
  const [...addrs] = await ethers.getSigners();

  // Setting a JSON RPC Provider with the Localnode RPC URL
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  // Getting contract object for the deployed ERC1155 token contract
  const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi,
    provider
  );

  const db = "dummy2";

  // Contract event-listener method call
  contract.on(
    "TransferSingle" /* Name of the event to be listened for */,
    async (operator, from, to, id, value) => {
      /* Callback fn for updating database when an event is emitted on the node */
      console.log(from, to, id, value);

      if (from === zeroAddress) {
        // if `from` is zero address, it means a new token was minted

        await insertData(db, id, [from, to]); // Hence new record is inserted into the ownerlist table
      } else {
        let { exists } = await idRecordExists(db, id); // Destructuring Promise to get True/False value
        if (exists) {
          // If record exists...
          const owner = await getOwnersList(db, id); // Fetches the existing record...
          let { _owners } = owner[0]; // Destructures JSON object...
          let ownerlist = _owners.split(","); // Converts CSV string into Array...
          let modifiedOwnerList = await modifyList(
            contract,
            ownerlist,
            from,
            to,
            id
          ); // Modifies the list...
          console.log(ownerlist);
          await updateData(db, id, modifiedOwnerList); // Updates the modified list to the table
        }
      }
    }
  );
}

main().catch((error) => {
  console.error(error);
});
