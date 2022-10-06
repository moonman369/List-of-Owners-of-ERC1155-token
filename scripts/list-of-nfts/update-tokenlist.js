// Script to explicitly add or modify a tokenlist record

const { ethers } = require("hardhat");
const { createFilter } = require("./create-log-filter");
const {
  ownerRecordExists,
  updateTokenList,
  insertTokenList,
} = require("./db-utils-2");
const { fetchContracts, getAddressInfo } = require("./get-token-list");
const prompt = require("prompt");

/**
 * Function to handle additions or modifications (based on the args) made to the db
 * and make corresponding changes to the same
 * */
async function recordHandler(provider, address, filter, tableName) {
  // Fetching contract addresses from eventlogs
  let contracts = await fetchContracts(provider, filter);

  // Getting the final tokenlist object
  let addressInfo = await getAddressInfo(provider, contracts, address);
  console.log(addressInfo);

  // Checking if the record already exists
  const { exists } = await ownerRecordExists(tableName, address);

  if (exists) {
    // Update existing record if yes
    await updateTokenList(tableName, address, addressInfo);
  } else {
    // Add new record otherwise
    insertTokenList(tableName, address, addressInfo);
  }
}

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  prompt.start();

  prompt.get(["address", "tableName"], async (error, result) => {
    if (error) return console.error(error.message);
    let filter = await createFilter(
      null,
      0,
      await provider.getBlockNumber("latest"),
      ["Transfer(address,address,uint256)", "", result.address]
    );

    await recordHandler(provider, result.address, filter, result.tableName);
  });
}

module.exports = {
  recordHandler,
};

main()
  .then()
  .catch((error) => console.log(error));
