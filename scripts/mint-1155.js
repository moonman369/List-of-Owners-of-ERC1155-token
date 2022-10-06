const { ethers } = require("hardhat");
const { abi } = require("../artifacts/contracts/FireNFT.sol/FireNFT.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );
  const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi,
    provider
  );

  const [...addrs] = await ethers.getSigners();

  await contract.connect(addrs[2]).mintCollection(addrs[5].address, 100);
}

main()
  .then()
  .catch((error) => {
    console.log(error);
  });
