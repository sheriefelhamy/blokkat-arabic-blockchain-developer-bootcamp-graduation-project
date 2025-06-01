// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Test.sol";
import "../src/Tickets.sol";
import "../src/Factory.sol";

contract TicketsTest is Test {
    Tickets public tickets;
    Factory public factory;

    address public owner = address(0x123);
    address public user1 = address(0x456);
    address public user2 = address(0x789);

    string constant EVENT_NAME = "Test Concert";
    string constant TOKEN_NAME = "Concert Tickets";
    string constant TOKEN_SYMBOL = "TICKET";
    string constant TOKEN_URI = "https://example.com/ticket/";

    function setUp() public {
        // Deploy Factory contract
        factory = new Factory();

        // Deploy Tickets contract directly for testing
        vm.prank(owner);
        tickets = new Tickets(TOKEN_NAME, TOKEN_SYMBOL, EVENT_NAME, owner);

        // Give test accounts some ETH
        vm.deal(owner, 10 ether);
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    // ========== TICKETS CONTRACT TESTS ==========

    function testTicketInitialization() public view {
        assertEq(tickets.name(), TOKEN_NAME);
        assertEq(tickets.symbol(), TOKEN_SYMBOL);
        assertEq(tickets.eventName(), EVENT_NAME);
        assertEq(tickets.owner(), owner);
        assertEq(tickets.ticketPrice(), 0.01 ether);
        assertEq(tickets.maxSupply(), 1000);
        assertTrue(tickets.saleActive());
    }

    function testMintTicket() public {
        vm.prank(user1);
        uint256 tokenId = tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        assertEq(tokenId, 0);
        assertEq(tickets.ownerOf(tokenId), user1);
        assertEq(tickets.tokenURI(tokenId), TOKEN_URI);
        assertTrue(tickets.isTicketValid(tokenId));

        (
            bool isUsed,
            uint256 purchaseTime,
            address originalOwner,
            address currentOwner
        ) = tickets.getTicketInfo(tokenId);
        assertFalse(isUsed);
        assertGt(purchaseTime, 0);
        assertEq(originalOwner, user1);
        assertEq(currentOwner, user1);
    }

    function testMintTicketWithExcessPayment() public {
        uint256 initialBalance = user1.balance;

        vm.prank(user1);
        tickets.mintTicket{value: 0.05 ether}(TOKEN_URI);

        // Should refund excess payment
        assertEq(user1.balance, initialBalance - 0.01 ether);
    }

    function testMintTicketFailsWhenSaleInactive() public {
        vm.prank(owner);
        tickets.toggleSale();

        vm.prank(user1);
        vm.expectRevert("Sale is not active");
        tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);
    }

    function testMintTicketFailsWithInsufficientPayment() public {
        vm.prank(user1);
        vm.expectRevert("Insufficient payment");
        tickets.mintTicket{value: 0.005 ether}(TOKEN_URI);
    }

    function testMintTicketFailsWhenMaxSupplyReached() public {
        vm.prank(owner);
        tickets.setMaxSupply(1);

        vm.prank(user1);
        tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        vm.prank(user2);
        vm.expectRevert("Max supply reached");
        tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);
    }

    function testOwnerMintTicket() public {
        vm.prank(owner);
        uint256 tokenId = tickets.ownerMintTicket(user1, TOKEN_URI);

        assertEq(tokenId, 0);
        assertEq(tickets.ownerOf(tokenId), user1);
        assertEq(tickets.tokenURI(tokenId), TOKEN_URI);
    }

    function testOwnerMintTicketFailsForNonOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        tickets.ownerMintTicket(user2, TOKEN_URI);
    }

    function testUseTicket() public {
        vm.prank(user1);
        uint256 tokenId = tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        assertTrue(tickets.isTicketValid(tokenId));

        vm.prank(owner);
        tickets.useTicket(tokenId);

        assertFalse(tickets.isTicketValid(tokenId));

        (bool isUsed, , , ) = tickets.getTicketInfo(tokenId);
        assertTrue(isUsed);
    }

    function testUseTicketFailsForNonOwner() public {
        vm.prank(user1);
        uint256 tokenId = tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        vm.prank(user2);
        vm.expectRevert();
        tickets.useTicket(tokenId);
    }

    function testUseTicketFailsWhenAlreadyUsed() public {
        vm.prank(user1);
        uint256 tokenId = tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        vm.prank(owner);
        tickets.useTicket(tokenId);

        vm.prank(owner);
        vm.expectRevert("Ticket already used");
        tickets.useTicket(tokenId);
    }

    function testSetTicketPrice() public {
        vm.prank(owner);
        tickets.setTicketPrice(0.02 ether);

        assertEq(tickets.ticketPrice(), 0.02 ether);
    }

    function testSetMaxSupply() public {
        vm.prank(owner);
        tickets.setMaxSupply(500);

        assertEq(tickets.maxSupply(), 500);
    }

    function testSetMaxSupplyFailsWhenBelowCurrentSupply() public {
        vm.prank(user1);
        tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        vm.prank(owner);
        vm.expectRevert("Cannot set max supply below current supply");
        tickets.setMaxSupply(0);
    }

    function testToggleSale() public {
        assertTrue(tickets.saleActive());

        vm.prank(owner);
        tickets.toggleSale();

        assertFalse(tickets.saleActive());
    }

    function testWithdrawFunds() public {
        vm.prank(user1);
        tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        uint256 ownerBalanceBefore = owner.balance;

        vm.prank(owner);
        tickets.withdrawFunds();

        assertEq(owner.balance, ownerBalanceBefore + 0.01 ether);
        assertEq(tickets.getContractBalance(), 0);
    }

    function testWithdrawFundsFailsWhenNoFunds() public {
        vm.prank(owner);
        vm.expectRevert("No funds to withdraw");
        tickets.withdrawFunds();
    }

    function testGetTokensByOwner() public {
        vm.prank(user1);
        tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        vm.prank(user1);
        tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        uint256[] memory tokens = tickets.getTokensByOwner(user1);
        assertEq(tokens.length, 2);
        assertEq(tokens[0], 0);
        assertEq(tokens[1], 1);
    }

    function testGetCurrentTokenId() public {
        assertEq(tickets.getCurrentTokenId(), 0);

        vm.prank(user1);
        tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        assertEq(tickets.getCurrentTokenId(), 1);
    }

    function testGetTotalSupply() public {
        assertEq(tickets.getTotalSupply(), 0);

        vm.prank(user1);
        tickets.mintTicket{value: 0.01 ether}(TOKEN_URI);

        assertEq(tickets.getTotalSupply(), 1);
    }

    // ========== FACTORY CONTRACT TESTS ==========

    function testDeployContract() public {
        vm.prank(user1);
        factory.deployContract(TOKEN_NAME, TOKEN_SYMBOL, EVENT_NAME);

        assertEq(factory.getTotalContracts(), 1);

        address deployedContract = factory.getDeployedContract(0);
        assertEq(factory.contractOwners(deployedContract), user1);
        assertEq(factory.contractNames(deployedContract), EVENT_NAME);
    }

    function testGetDeployedContracts() public {
        vm.prank(user1);
        factory.deployContract(TOKEN_NAME, TOKEN_SYMBOL, EVENT_NAME);

        vm.prank(user2);
        factory.deployContract("Event 2", "TIX2", "Concert 2");

        address[] memory deployedContracts = factory.getDeployedContracts();
        assertEq(deployedContracts.length, 2);
    }

    function testGetDeployedContractFailsWithInvalidIndex() public {
        vm.expectRevert("Index out of bounds");
        factory.getDeployedContract(0);
    }

    function testGetContractsByOwner() public {
        vm.prank(user1);
        factory.deployContract(TOKEN_NAME, TOKEN_SYMBOL, EVENT_NAME);

        vm.prank(user1);
        factory.deployContract("Event 2", "TIX2", "Concert 2");

        vm.prank(user2);
        factory.deployContract("Event 3", "TIX3", "Concert 3");

        address[] memory user1Contracts = factory.getContractsByOwner(user1);
        address[] memory user2Contracts = factory.getContractsByOwner(user2);

        assertEq(user1Contracts.length, 2);
        assertEq(user2Contracts.length, 1);
    }

    function testGetTotalContracts() public {
        assertEq(factory.getTotalContracts(), 0);

        vm.prank(user1);
        factory.deployContract(TOKEN_NAME, TOKEN_SYMBOL, EVENT_NAME);

        assertEq(factory.getTotalContracts(), 1);

        vm.prank(user2);
        factory.deployContract("Event 2", "TIX2", "Concert 2");

        assertEq(factory.getTotalContracts(), 2);
    }

    // ========== INTEGRATION TESTS ==========

    function testFactoryDeployedContractFunctionality() public {
        // Deploy contract through factory
        vm.prank(user1);
        factory.deployContract(TOKEN_NAME, TOKEN_SYMBOL, EVENT_NAME);

        // Get the deployed contract
        address deployedAddress = factory.getDeployedContract(0);
        Tickets deployedTickets = Tickets(deployedAddress);

        // Test that the deployed contract works correctly
        assertEq(deployedTickets.owner(), user1);
        assertEq(deployedTickets.eventName(), EVENT_NAME);

        // Test minting with the deployed contract
        vm.prank(user2);
        uint256 tokenId = deployedTickets.mintTicket{value: 0.01 ether}(
            TOKEN_URI
        );

        assertEq(deployedTickets.ownerOf(tokenId), user2);
        assertTrue(deployedTickets.isTicketValid(tokenId));
    }

    function testMultipleContractsFromFactory() public {
        // Deploy multiple contracts
        vm.prank(user1);
        factory.deployContract("Concert A", "CONA", "Rock Concert");

        vm.prank(user2);
        factory.deployContract("Concert B", "CONB", "Jazz Concert");

        // Get contracts
        address contract1 = factory.getDeployedContract(0);
        address contract2 = factory.getDeployedContract(1);

        Tickets tickets1 = Tickets(contract1);
        Tickets tickets2 = Tickets(contract2);

        // Verify they're separate contracts with different owners
        assertEq(tickets1.owner(), user1);
        assertEq(tickets2.owner(), user2);
        assertEq(tickets1.eventName(), "Rock Concert");
        assertEq(tickets2.eventName(), "Jazz Concert");

        // Verify they function independently
        vm.prank(user1);
        tickets1.setTicketPrice(0.02 ether);

        assertEq(tickets1.ticketPrice(), 0.02 ether);
        assertEq(tickets2.ticketPrice(), 0.01 ether); // Should remain default
    }
}
