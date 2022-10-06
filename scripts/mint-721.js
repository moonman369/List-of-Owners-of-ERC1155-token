const { ethers } = require("hardhat");
const NFT1 = require("../artifacts/contracts/NFT1.sol/NFT1.json");
const NFT2 = require("../artifacts/contracts/NFT2.sol/NFT2.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  const [...addrs] = await ethers.getSigners();

  const nft1 = new ethers.Contract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    NFT1.abi,
    provider
  );

  const nft2 = new ethers.Contract(
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    NFT2.abi,
    provider
  );

  await nft1.connect(addrs[0]).mintItem(addrs[0].address);
  await nft1.connect(addrs[3]).mintItem(addrs[3].address);
  let tx = await nft1.connect(addrs[0]).mintItem(addrs[0].address);
  let result = await tx.wait();

  await nft2.connect(addrs[0]).mintItem(addrs[0].address);
  await nft2.connect(addrs[1]).mintItem(addrs[1].address);
  await nft2.connect(addrs[2]).mintItem(addrs[2].address);
  tx = await nft2.connect(addrs[1]).mintItem(addrs[1].address);
  result = await tx.wait();
  const id = result.events[0].args.tokenId;
  await nft2
    .connect(addrs[1])
    .transferFrom(addrs[1].address, addrs[2].address, id);
  await nft2
    .connect(addrs[2])
    .transferFrom(addrs[2].address, addrs[3].address, id);
}

main()
  .then()
  .catch((error) => console.log(error));
