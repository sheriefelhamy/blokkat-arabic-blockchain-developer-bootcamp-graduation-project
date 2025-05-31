// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "./Tickets.sol";

contract Factory {
    address[] public deployedContracts;
    mapping(address => address) public contractOwners;
    mapping(address => string) public contractNames;

    event ContractDeployed(address contractAddress, address owner, string name);

    function deployContract(
        string memory name,
        string memory symbol,
        string memory eventName
    ) external {
        Tickets newContract = new Tickets(name, symbol, eventName, msg.sender);
        address contractAddress = address(newContract);

        deployedContracts.push(contractAddress);
        contractOwners[contractAddress] = msg.sender;
        contractNames[contractAddress] = eventName;

        emit ContractDeployed(contractAddress, msg.sender, eventName);
    }

    function getDeployedContracts() external view returns (address[] memory) {
        return deployedContracts;
    }

    function getDeployedContract(
        uint256 index
    ) external view returns (address) {
        require(index < deployedContracts.length, "Index out of bounds");
        return deployedContracts[index];
    }

    function getContractsByOwner(
        address owner
    ) external view returns (address[] memory) {
        uint256 count = 0;

        // Count contracts owned by the address
        for (uint256 i = 0; i < deployedContracts.length; i++) {
            if (contractOwners[deployedContracts[i]] == owner) {
                count++;
            }
        }

        // Create array with exact size
        address[] memory ownedContracts = new address[](count);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < deployedContracts.length; i++) {
            if (contractOwners[deployedContracts[i]] == owner) {
                ownedContracts[currentIndex] = deployedContracts[i];
                currentIndex++;
            }
        }

        return ownedContracts;
    }

    function getTotalContracts() external view returns (uint256) {
        return deployedContracts.length;
    }
}
