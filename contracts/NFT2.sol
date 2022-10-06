// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT2 is ERC721, Ownable {

    uint256 public latestTokenId;

    constructor () ERC721 ("Dummy NFT 2", "NFT2") {
        latestTokenId = 0;
    }

    function mintItem (address _to) public returns (uint256) {
        latestTokenId++;
        _mint(_to, latestTokenId);
        return latestTokenId;
    }
}