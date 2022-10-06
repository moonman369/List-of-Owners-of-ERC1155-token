const { ethers } = require("hardhat");
const { abi } = require("../artifacts/contracts/FireNFT.sol/FireNFT.json");
const { sleep } = require("./list-of-owners/db-utils");


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

  const sender = addrs[5];
  const operator = addrs[1];
  const receiver = addrs[7];

  await contract.connect(sender).setApprovalForAll(operator.address, true);

  await sleep(1000);
  await contract
    .connect(sender)
    .safeTransferFrom(sender.address, receiver.address, 1, 1, "0x00");

  await contract
    .connect(operator)
    .safeTransferFrom(sender.address, receiver.address, 1, 2, "0x00");

  let balance = await contract.balanceOf(addrs[6].address, 1);
  console.log(balance);
  await contract
    .connect(addrs[6])
    .safeTransferFrom(addrs[6].address, addrs[7].address, 1, balance, "0x00");
}

main()
  .then()
  .catch((error) => {
    console.log(error);
  });
