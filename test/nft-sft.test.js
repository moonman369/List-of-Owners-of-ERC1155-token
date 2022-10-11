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
    expect(await nft1.ownerOf(tokenId)).to.equal(addrs[0].address);
  });

  it("2. Users should be able to mint tokens to any other address", async () => {
    const tokenId = await nft1.callStatic.mintItem(addrs[6].address);
    await expect(nft1.connect(addrs[0]).mintItem(addrs[6].address)).to
      .eventually.be.fulfilled;
    expect(await nft1.ownerOf(tokenId)).to.equal(addrs[6].address);
  });

  it("3. Users should not be able to mint tokens to null address", async () => {
    await expect(nft1.connect(addrs[0]).mintItem(NULL_ADDRESS)).to.eventually.be
      .rejected;
  });
});

describe("II. Minting token on NFT2 contract", () => {
  it("1. Users should be able to mint tokens to own address", async () => {
    const tokenId = await nft2.callStatic.mintItem(addrs[0].address);
    await expect(nft2.connect(addrs[0]).mintItem(addrs[0].address)).to
      .eventually.be.fulfilled;
    expect(await nft2.ownerOf(tokenId)).to.equal(addrs[0].address);
  });

  it("2. Users should be able to mint tokens to any other address", async () => {
    const tokenId = await nft2.callStatic.mintItem(addrs[6].address);
    await expect(nft2.connect(addrs[0]).mintItem(addrs[6].address)).to
      .eventually.be.fulfilled;
    expect(await nft2.ownerOf(tokenId)).to.equal(addrs[6].address);
  });

  it("3. Users should not be able to mint tokens to null address", async () => {
    await expect(nft2.connect(addrs[0]).mintItem(NULL_ADDRESS)).to.eventually.be
      .rejected;
  });
});

describe("III. Minting and batchminting on FireNFT contract", () => {
  it("1. Users should be able to mint collections with desired supply", async () => {
    const collectionId = await fireNft.callStatic.mintCollection(
      addrs[0].address,
      100
    );
    await expect(
      fireNft.connect(addrs[0]).mintCollection(addrs[0].address, 100)
    ).to.eventually.be.fulfilled;

    expect(await fireNft.balanceOf(addrs[0].address, collectionId)).to.equal(
      100
    );
  });

  it("2. Users should be able to mint multiple collections at once", async () => {
    const mintToAddress = addrs[3].address;
    const collectionCount = 6;
    const mintAmounts = [1, 100, 10 ** 12, 5, 3424, 69];
    const batchMintArgs = [mintToAddress, collectionCount, mintAmounts];

    const collectionIds = await fireNft.callStatic.mintMultipleCollections(
      ...batchMintArgs
    );

    await expect(
      fireNft.connect(addrs[0]).mintMultipleCollections(...batchMintArgs)
    ).to.eventually.be.fulfilled;

    const addresses = [
      mintToAddress,
      mintToAddress,
      mintToAddress,
      mintToAddress,
      mintToAddress,
      mintToAddress,
    ];

    const balances = await fireNft.balanceOfBatch(addresses, collectionIds);
    let counter = 0;

    for (let balance of balances) {
      expect(balance).to.equal(mintAmounts[counter++]);
    }
  });
});
