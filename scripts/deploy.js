// Script to deploy ERC1155 and ERC721 token contracts to hardhat localhost network

const { ethers } = require("hardhat");
const hre = require("hardhat");

// Function to deploy ERC1155 contract
async function deployFireNFT(deployer, URI) {
  const FireNFT = await ethers.getContractFactory("FireNFT");
  const fireNft = await FireNFT.connect(deployer).deploy(URI);
  await fireNft.deployed();
  return { fireNft };
}

// Function to deploy ERC721 contracts
async function deployDummyNFTs(deployer) {
  const NFT1 = await ethers.getContractFactory("NFT1");
  const nft1 = await NFT1.connect(deployer).deploy();
  await nft1.deployed();

  const NFT2 = await ethers.getContractFactory("NFT2");
  const nft2 = await NFT2.connect(deployer).deploy();
  await nft2.deployed();
  return { nft1, nft2 };
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const { fireNft } = await deployFireNFT(deployer, "base_uri/");
  console.log(
    `FireNFT contract deployed to ${fireNft.address} by ${deployer.address}`
  );
  const { nft1, nft2 } = await deployDummyNFTs(deployer);
  console.log(
    `Dummy NFT 1 contract deployed to ${nft1.address} by ${deployer.address}\nDummy NFT 2 contract deployed to ${nft2.address} by ${deployer.address}`
  );
}

module.exports = {
  deployFireNFT,
  deployDummyNFTs,
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    // process.exitCode = 1;
  });
