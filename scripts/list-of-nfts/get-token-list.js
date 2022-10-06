// Script to get the final token list object corresponding to an owner, to be inserted into a table

const { ethers } = require("hardhat");
const { createFilter, extractTokenId } = require("./create-log-filter");

// Function to fetch the parent contracts of all the token transactions extracted from the event logs of a particular owner
// Returns a promise containing an array of contract addresses
async function fetchContracts(provider, filter) {
  return new Promise(async (resolve, reject) => {
    let logsList = await provider.getLogs(filter);
    let contracts = new Set();
    logsList.forEach((log) => {
      contracts.add(log.address);
    });
    resolve([...contracts]);
  });
}

// Function to return the token list object to be updated or inserted into the database
// Returns a Promise object
async function getAddressInfo(provider, contracts, address) {
  return new Promise(async (resolve, reject) => {
    let addressInfo = [address];
    for (let contract of contracts) {
      let [received, sent] = [new Array(), new Array()];

      // Mapping and extracting token ids that were received by the address, from the logs
      let filter = await createFilter(
        contract,
        0,
        provider.getBlockNumber("latest"),
        ["Transfer(address,address,uint256)", "", address]
      );
      let logsList = await provider.getLogs(filter);
      received = logsList.map(extractTokenId); // Storing received token ids

      // Mapping and extracting token ids that were sent by the address, from the logs
      filter = await createFilter(
        contract,
        0,
        provider.getBlockNumber("latest"),
        ["Transfer(address,address,uint256)", address, ""]
      );
      logsList = await provider.getLogs(filter);
      sent = logsList.map(extractTokenId); // Storing received token ids

      // Essentially the tokens that were received but not sent out are the ones currently owned by an address
      // Hence filtering the `received but not sent` tokenids
      let diff = received.filter((x) => !sent.includes(x));
      if (diff.length != 0)
        addressInfo.push({ contractAddress: contract, tokenIds: diff }); // pushing the object to the addressInfo array
    }
    resolve(addressInfo); // resolving the array
  });
}

module.exports = {
  fetchContracts,
  getAddressInfo,
};
