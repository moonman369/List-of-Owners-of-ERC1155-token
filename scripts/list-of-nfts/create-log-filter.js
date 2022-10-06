// Script for creating filters for fetching provider event logs

const { ethers } = require("hardhat");

// Custom callback fn to be using in `createFilter` fn
function hexZeroPad32(string) {
  if (string == "") return null;
  return ethers.utils.hexZeroPad(string, 32);
}

// Custom function to extract tokenIds from event topics and returning its decimal (base 10) version
function extractTokenId(log) {
  let tokenId = ethers.utils.hexStripZeros(log.topics[3]);
  return Number(tokenId);
}

// Function to create log filter objects from arg data
async function createFilter(
  _contractAddress,
  _fromBlock,
  _toBlock,
  _topicsList
) {
  // Isolating topic zero as it contains the 32 bytes hash of the event interface, eg: `Event(string,address,uint256,....)`
  let topicZero = _topicsList.shift();
  return {
    fromBlock: _fromBlock,
    toBlock: _toBlock,
    address: _contractAddress,
    topics: [ethers.utils.id(topicZero), ..._topicsList.map(hexZeroPad32)],
  };
}

module.exports = {
  createFilter,
  hexZeroPad32,
  extractTokenId,
};
