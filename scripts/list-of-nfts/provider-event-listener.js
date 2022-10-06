// Script to listen to provider events emitted in real time and updating the database accordingly

const { ethers } = require("hardhat");
const { createFilter } = require("./create-log-filter");
const { recordHandler } = require("./update-tokenlist");

const zeroAddress = "0x0000000000000000000000000000000000000000";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  // Creating a filter with `from`, `to` or `contract` address
  const filter = await createFilter(
    null,
    0,
    await provider.getBlockNumber("latest"),
    ["Transfer(address,address,uint256)"]
  );

  const tableName = "dummy1";

  // Calling the eventlistener method
  provider.on(filter, async (logs) => {
    const addresses = [
      ethers.utils.hexStripZeros(logs.topics[1]),
      ethers.utils.hexStripZeros(logs.topics[2]),
    ];

    for (let address of addresses) {
      if (address != "0x") {
        address = address.toLowerCase();
        let filter = await createFilter(
          null,
          0,
          await provider.getBlockNumber("latest"),
          ["Transfer(address,address,uint256)", "", address]
        );

        // Calling the record handler function from update tokenlist script
        // It handles all the processes and decisions for feeding the data to the db
        await recordHandler(provider, address, filter, tableName);
      }
    }
  });
}

main()
  .then()
  .catch((error) => {
    console.error(error.message);
  });
