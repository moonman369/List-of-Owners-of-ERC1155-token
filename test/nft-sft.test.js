const { ethers } = require("hardhat");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { BigNumber } = require("ethers");

const expect = chai.expect;
chai.use(chaiAsPromised);

let deployer, addrs;
let nft1, nft2;
let fireNft;

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

before(async () => {
  [deployer, ...addrs] = await ethers.getSigners();

  const NFT1 = await ethers.getContractFactory("NFT1");
  nft1 = await NFT1.connect(deployer).deploy();
  await nft1.deployed();

  const NFT2 = await ethers.getContractFactory("NFT2");
  nft2 = await NFT2.connect(deployer).deploy();
  await nft2.deployed();

  const FireNFT = await ethers.getContractFactory("FireNFT");
  fireNft = await FireNFT.connect(deployer).deploy("fire-uri/");
  await fireNft.deployed();
});

describe("I. Minting token on NFT1 contract", () => {
  it("1. Users should be able to mint tokens to own address", async () => {
    const tokenId = await nft1.callStatic.mintItem(addrs[0].address);
    await expect(nft1.connect(addrs[0]).mintItem(addrs[0].address)).to
      .eventually.be.fulfilled;
  });
});
