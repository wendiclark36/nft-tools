// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Certification is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(string => uint256) private existingURIs;

    constructor() ERC721("Certification", "CRT"){}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 mintedTokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, mintedTokenId);
        _setTokenURI(mintedTokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenIdToSearch)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenIdToSearch);
    }

    function tokenId(string memory uri)
        public
        view
        returns (uint256)
    {
        return existingURIs[uri];
    }

    function _burn(uint256 tokenIdToBurn) internal override(ERC721, ERC721URIStorage) {
        string memory uri = tokenURI(tokenIdToBurn);
        require(existingURIs[uri] != 0, "No Certification with this Id");
        
        existingURIs[uri] = 0;
        _tokenIdCounter.decrement();
        super._burn(tokenIdToBurn);
    }

    function isCertificationOwned(string memory uri) public view returns (bool){
        return existingURIs[uri] != 0;
    }

    // Mint an NFT
    function learnToMint(address recipient, string memory uri) public payable returns (uint256) {
        require(existingURIs[uri] == 0, "Certification already achieved!");
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        existingURIs[uri] = newItemId;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, uri);

        return newItemId;
    }

    //Get count of NFTs
    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}