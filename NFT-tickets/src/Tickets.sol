// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tickets is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    string public eventName;
    uint256 public ticketPrice;
    uint256 public maxSupply;
    bool public saleActive;

    // Ticket information
    struct TicketInfo {
        bool isUsed;
        uint256 purchaseTime;
        address originalOwner;
    }

    mapping(uint256 => TicketInfo) public ticketDetails;

    event TicketMinted(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );
    event TicketUsed(uint256 indexed tokenId, address indexed user);
    event SaleStatusChanged(bool isActive);

    constructor(
        string memory name,
        string memory symbol,
        string memory _eventName,
        address _owner
    ) ERC721(name, symbol) Ownable(_owner) {
        eventName = _eventName;
        ticketPrice = 0.01 ether; // Default price
        maxSupply = 1000; // Default max supply
        saleActive = true;
    }

    // Public minting function (anyone can buy tickets)
    function mintTicket(
        string memory tokenURI
    ) external payable returns (uint256) {
        require(saleActive, "Sale is not active");
        require(msg.value >= ticketPrice, "Insufficient payment");
        require(_tokenIdCounter < maxSupply, "Max supply reached");

        uint256 newTokenId = _tokenIdCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Store ticket details
        ticketDetails[newTokenId] = TicketInfo({
            isUsed: false,
            purchaseTime: block.timestamp,
            originalOwner: msg.sender
        });

        _tokenIdCounter++;

        emit TicketMinted(newTokenId, msg.sender, msg.value);

        // Refund excess payment
        if (msg.value > ticketPrice) {
            payable(msg.sender).transfer(msg.value - ticketPrice);
        }

        return newTokenId;
    }

    // Owner can mint free tickets
    function ownerMintTicket(
        address to,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        require(_tokenIdCounter < maxSupply, "Max supply reached");

        uint256 newTokenId = _tokenIdCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        ticketDetails[newTokenId] = TicketInfo({
            isUsed: false,
            purchaseTime: block.timestamp,
            originalOwner: to
        });

        _tokenIdCounter++;

        emit TicketMinted(newTokenId, to, 0);

        return newTokenId;
    }

    // Mark ticket as used (only owner can do this)
    function useTicket(uint256 tokenId) external onlyOwner {
        require(!ticketDetails[tokenId].isUsed, "Ticket already used");

        ticketDetails[tokenId].isUsed = true;
        emit TicketUsed(tokenId, ownerOf(tokenId));
    }

    // Check if ticket is valid (exists and not used)
    function isTicketValid(uint256 tokenId) external view returns (bool) {
        return !ticketDetails[tokenId].isUsed;
    }

    // Get ticket information
    function getTicketInfo(
        uint256 tokenId
    )
        external
        view
        returns (
            bool isUsed,
            uint256 purchaseTime,
            address originalOwner,
            address currentOwner
        )
    {
        TicketInfo memory info = ticketDetails[tokenId];
        return (
            info.isUsed,
            info.purchaseTime,
            info.originalOwner,
            ownerOf(tokenId)
        );
    }

    // Owner functions
    function setTicketPrice(uint256 _price) external onlyOwner {
        ticketPrice = _price;
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        require(
            _maxSupply >= _tokenIdCounter,
            "Cannot set max supply below current supply"
        );
        maxSupply = _maxSupply;
    }

    function toggleSale() external onlyOwner {
        saleActive = !saleActive;
        emit SaleStatusChanged(saleActive);
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    // View functions
    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function getTotalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Get all tokens owned by an address
    function getTokensByOwner(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (ownerOf(i) == owner) {
                tokens[currentIndex] = i;
                currentIndex++;
            }
        }

        return tokens;
    }
}
