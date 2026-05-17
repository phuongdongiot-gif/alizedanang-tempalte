// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title AlizePropertyFraction
 * @dev Simulated ERC-3643 (T-REX) compliance on top of ERC-1155 for Real Estate Fractional Ownership.
 * In a real institutional deployment, you would inherit from the actual ERC-3643 standard 
 * and integrate with ONCHAINID. This is a functional approximation for the Alize Platform.
 */
contract AlizePropertyFraction is ERC1155, Ownable {
    using Strings for uint256;

    string public name = "Alize Real Estate Property";
    string public symbol = "ALIZE-PROP";

    // Mappings for KYC / Whitelisting (Compliance)
    mapping(address => bool) public isKYCVerified;
    mapping(address => bool) public isBlacklisted;

    // Property Details
    struct Property {
        uint256 id;
        uint256 totalShares;
        uint256 pricePerShare;
        address propertyManager;
        bool isActive;
    }

    mapping(uint256 => Property) public properties;
    uint256 public nextPropertyId = 1;

    // Events
    event KYCStatusChanged(address indexed user, bool status);
    event PropertyCreated(uint256 indexed id, uint256 totalShares, uint256 pricePerShare);
    event SharesPurchased(address indexed buyer, uint256 indexed propertyId, uint256 amount);

    constructor() ERC1155("https://api.alizedanang.net/metadata/properties/{id}.json") Ownable(msg.sender) {}

    // --- Compliance Modifiers ---

    modifier onlyVerified(address account) {
        require(isKYCVerified[account], "Error: Wallet has not passed KYC");
        require(!isBlacklisted[account], "Error: Wallet is blacklisted");
        _;
    }

    // --- Admin Functions ---

    function setKYCStatus(address user, bool status) external onlyOwner {
        isKYCVerified[user] = status;
        emit KYCStatusChanged(user, status);
    }

    function setBlacklistStatus(address user, bool status) external onlyOwner {
        isBlacklisted[user] = status;
    }

    function createProperty(uint256 _totalShares, uint256 _pricePerShare) external onlyOwner returns (uint256) {
        uint256 propertyId = nextPropertyId++;
        
        properties[propertyId] = Property({
            id: propertyId,
            totalShares: _totalShares,
            pricePerShare: _pricePerShare,
            propertyManager: msg.sender,
            isActive: true
        });

        // Mint all shares to the owner (SPV Treasury) initially
        _mint(msg.sender, propertyId, _totalShares, "");

        emit PropertyCreated(propertyId, _totalShares, _pricePerShare);
        return propertyId;
    }

    // --- User Functions ---

    /**
     * @dev Buy shares directly from the Treasury.
     * Note: Users must be KYC verified.
     */
    function buyShares(uint256 propertyId, uint256 amount) external payable onlyVerified(msg.sender) {
        Property memory prop = properties[propertyId];
        require(prop.isActive, "Property is not active");
        require(msg.value == prop.pricePerShare * amount, "Incorrect payment amount");
        require(balanceOf(owner(), propertyId) >= amount, "Not enough shares available in Treasury");

        // Transfer shares from Treasury (owner) to Buyer
        _safeTransferFrom(owner(), msg.sender, propertyId, amount, "");

        emit SharesPurchased(msg.sender, propertyId, amount);
    }

    // --- Overrides for Compliance ---

    /**
     * @dev Override ERC1155 safeTransferFrom to enforce KYC rules on ALL transfers,
     * mimicking ERC-3643 compliance mechanisms.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override onlyVerified(from) onlyVerified(to) {
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override onlyVerified(from) onlyVerified(to) {
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    // Admin function to withdraw funds
    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
