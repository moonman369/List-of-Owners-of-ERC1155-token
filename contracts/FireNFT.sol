// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FireNFT is ERC1155, Ownable {
    uint256 public tokenCollection;

    constructor (string memory _uri) ERC1155 (_uri) {
        tokenCollection = 0;
    }


    //Functions: Mint

    function mintCollection (address _to, uint256 _amount) external virtual payable returns (uint256) {
        tokenCollection++;
        uint256 newCollectionId = tokenCollection;
        _mint (_to, newCollectionId, _amount, "");
        return newCollectionId;
    }

    function mintMultipleCollections (address _to, uint256 _collectionCount, uint256[] memory _amounts) external virtual payable {
        require (_collectionCount == _amounts.length, "Invalid array length");
        uint256[] memory tokenCollectionIds = new uint256[] (_collectionCount);
        for (uint256 i = 0; i < _collectionCount; i++) {
            tokenCollection++;
            tokenCollectionIds[i] = tokenCollection;
        }
        _mintBatch (_to, tokenCollectionIds, _amounts, "");
    }


    // Functions: Burn
    
    // function burnMNC (address _from, uint256 _amount) external virtual onlyOwner {
    //     _burn (_from, MNC, _amount);
    // }

    // function burnMONKE (address _from, uint256 _amount) external virtual onlyOwner {
    //     _burn (_from, MONKE, _amount);
    // }

    // function burnMGOV (address _from, uint256 _amount) external virtual onlyOwner {
    //     _burn (_from, MGOV, _amount);
    // }

    // function burnMNK (address _from, uint256 _amount) external virtual onlyOwner {
    //     _burn (_from, MNK, _amount);
    // }

    function burnBatch (address _from, uint256[] memory _ids, uint256[] memory _amounts) external virtual onlyOwner {
        _burnBatch (_from, _ids, _amounts);
    }

}