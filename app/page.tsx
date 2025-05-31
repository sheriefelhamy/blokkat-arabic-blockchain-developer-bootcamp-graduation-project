'use client'

import { useWriteContract, useReadContract, useAccount } from "wagmi";
import React, { useState } from "react";

export default function TicketSystem() {
  // Updated ABIs for enhanced contracts
  const FACTORYABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "contractAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "ContractDeployed",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "contractNames",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "contractOwners",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "eventName",
          "type": "string"
        }
      ],
      "name": "deployContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "deployedContracts",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getContractsByOwner",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getDeployedContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getDeployedContracts",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalContracts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const TICKETABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_eventName",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        }
      ],
      "name": "BatchMetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "MetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "name": "SaleStatusChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "TicketMinted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "TicketUsed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "eventName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentTokenId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getTicketInfo",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isUsed",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "purchaseTime",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "originalOwner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "currentOwner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getTokensByOwner",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "isTicketValid",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "tokenURI",
          "type": "string"
        }
      ],
      "name": "mintTicket",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "tokenURI",
          "type": "string"
        }
      ],
      "name": "ownerMintTicket",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "saleActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_maxSupply",
          "type": "uint256"
        }
      ],
      "name": "setMaxSupply",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "setTicketPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ticketDetails",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isUsed",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "purchaseTime",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "originalOwner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ticketPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "toggleSale",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "useTicket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const FACTORYADDRESS = "0x816631D7A13bc45BAbd54e0Bbb14c0eb32D37937" as `0x${string}`;

  const { writeContract } = useWriteContract();
  const { address: userAddress } = useAccount();

  // State for creating events
  const [name, setName] = useState('Concert Tickets');
  const [symbol, setSymbol] = useState('CNCT');
  const [eventName, setEventName] = useState('Rock Concert 2025');
  const [isDeploying, setIsDeploying] = useState(false);

  // State for ticket purchasing
  const [selectedContract, setSelectedContract] = useState('');
  const [tokenURI, setTokenURI] = useState('https://ipfs.io/ipfs/QmYourHash');
  const [isMinting, setIsMinting] = useState(false);

  // State for managing events
  const [newPrice, setNewPrice] = useState('0.01');
  const [activeTab, setActiveTab] = useState('create');

  // Fetch all deployed contracts
  const { data: allContracts, isLoading: isLoadingAll } = useReadContract({
    address: FACTORYADDRESS,
    abi: FACTORYABI,
    functionName: 'getDeployedContracts',
  });

  // Fetch user's contracts
  const { data: userContracts, isLoading: isLoadingUser } = useReadContract({
    address: FACTORYADDRESS,
    abi: FACTORYABI,
    functionName: 'getContractsByOwner',
    args: userAddress ? [userAddress] : undefined,
  });

  // Get contract name for selected contract
  const { data: contractName } = useReadContract({
    address: FACTORYADDRESS,
    abi: FACTORYABI,
    functionName: 'contractNames',
    args: selectedContract ? [selectedContract as `0x${string}`] : undefined,
  });

  // Get ticket details for selected contract
  const { data: ticketPrice } = useReadContract({
    address: selectedContract as `0x${string}`,
    abi: TICKETABI,
    functionName: 'ticketPrice',
    query: { enabled: !!selectedContract }
  });

  const { data: currentSupply } = useReadContract({
    address: selectedContract as `0x${string}`,
    abi: TICKETABI,
    functionName: 'getCurrentTokenId',
    query: { enabled: !!selectedContract }
  });

  const { data: maxSupply } = useReadContract({
    address: selectedContract as `0x${string}`,
    abi: TICKETABI,
    functionName: 'maxSupply',
    query: { enabled: !!selectedContract }
  });

  const { data: saleActive } = useReadContract({
    address: selectedContract as `0x${string}`,
    abi: TICKETABI,
    functionName: 'saleActive',
    query: { enabled: !!selectedContract }
  });

  const { data: contractOwner } = useReadContract({
    address: selectedContract as `0x${string}`,
    abi: TICKETABI,
    functionName: 'owner',
    query: { enabled: !!selectedContract }
  });

  const { data: userTickets } = useReadContract({
    address: selectedContract as `0x${string}`,
    abi: TICKETABI,
    functionName: 'getTokensByOwner',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!selectedContract && !!userAddress }
  });

  // Deploy new event contract
  const deployContract = async () => {
    if (!name || !symbol || !eventName) return;

    setIsDeploying(true);
    try {
      await writeContract({
        address: FACTORYADDRESS,
        abi: FACTORYABI,
        functionName: 'deployContract',
        args: [name, symbol, eventName],
      });
    } catch (error) {
      console.error('Deploy error:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  // Mint ticket
  const mintTicket = async () => {
    if (!selectedContract || !tokenURI || !ticketPrice) return;

    setIsMinting(true);
    try {
      await writeContract({
        address: selectedContract as `0x${string}`,
        abi: TICKETABI,
        functionName: 'mintTicket',
        args: [tokenURI],
        value: BigInt(ticketPrice.toString()),
      });
    } catch (error) {
      console.error('Mint error:', error);
    } finally {
      setIsMinting(false);
    }
  };

  // Update ticket price (owner only)
  const updatePrice = async () => {
    if (!selectedContract || !newPrice) return;

    try {
      const priceInWei = BigInt(Math.floor(parseFloat(newPrice) * 1e18));
      await writeContract({
        address: selectedContract as `0x${string}`,
        abi: TICKETABI,
        functionName: 'setTicketPrice',
        args: [priceInWei],
      });
    } catch (error) {
      console.error('Update price error:', error);
    }
  };

  // Toggle sale status
  const toggleSale = async () => {
    if (!selectedContract) return;

    try {
      await writeContract({
        address: selectedContract as `0x${string}`,
        abi: TICKETABI,
        functionName: 'toggleSale',
      });
    } catch (error) {
      console.error('Toggle sale error:', error);
    }
  };

  // Withdraw funds
  const withdrawFunds = async () => {
    if (!selectedContract) return;

    try {
      await writeContract({
        address: selectedContract as `0x${string}`,
        abi: TICKETABI,
        functionName: 'withdrawFunds',
      });
    } catch (error) {
      console.error('Withdraw error:', error);
    }
  };

  const formatEther = (wei: bigint) => {
    return (Number(wei) / 1e18).toFixed(4);
  };

  const isOwner = contractOwner && userAddress && contractOwner.toLowerCase() === userAddress.toLowerCase();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🎫 Ticket System</h1>
        <div className="flex gap-4 justify-center mb-4">
          <w3m-button />
          <w3m-network-button />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['create', 'buy', 'manage', 'tickets'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md capitalize ${activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
                }`}
            >
              {tab === 'create' && '🏗️ Create Event'}
              {tab === 'buy' && '🎫 Buy Tickets'}
              {tab === 'manage' && '⚙️ Manage Events'}
              {tab === 'tickets' && '🎟️ My Tickets'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Create Event Tab */}
          {activeTab === 'create' && (
            <div className="bg-white rounded-lg shadow-md p-6 text-black">
              <h2 className="text-2xl font-semibold mb-4">🏗️ Create New Event</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Event Name</label>
                  <input
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full border rounded-lg p-3"
                    placeholder="Amazing Concert 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ticket Collection Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg p-3"
                    placeholder="Concert Tickets"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ticket Symbol</label>
                  <input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full border rounded-lg p-3"
                    placeholder="CNCT"
                  />
                </div>
                <button
                  onClick={deployContract}
                  disabled={isDeploying || !userAddress}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  {isDeploying ? '🚀 Deploying...' : '🏗️ Create Event Contract'}
                </button>
              </div>
            </div>
          )}

          {/* Buy Tickets Tab */}
          {activeTab === 'buy' && (
            <div className="bg-white rounded-lg shadow-md p-6 text-black">
              <h2 className="text-2xl font-semibold mb-4">🎫 Buy Tickets</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Event</label>
                  <select
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="">Choose an event...</option>
                    {allContracts?.map((addr, idx) => (
                      <option key={idx} value={addr}>
                        {addr.slice(0, 6)}...{addr.slice(-4)}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedContract && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Event Details</h3>
                      <p><strong>Name:</strong> {contractName || 'Loading...'}</p>
                      <p><strong>Price:</strong> {ticketPrice ? `${formatEther(ticketPrice)} ETH` : 'Loading...'}</p>
                      <p><strong>Available:</strong> {currentSupply && maxSupply ? `${Number(maxSupply) - Number(currentSupply)} / ${Number(maxSupply)}` : 'Loading...'}</p>
                      <p><strong>Status:</strong>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${saleActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {saleActive ? '🟢 Sale Active' : '🔴 Sale Paused'}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Ticket Metadata URI</label>
                      <input
                        value={tokenURI}
                        onChange={(e) => setTokenURI(e.target.value)}
                        className="w-full border rounded-lg p-3"
                        placeholder="https://ipfs.io/ipfs/your-metadata-hash"
                      />
                    </div>

                    <button
                      onClick={mintTicket}
                      disabled={isMinting || !saleActive || !userAddress}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                    >
                      {isMinting ? '🎫 Minting...' : `🎫 Buy Ticket (${ticketPrice ? formatEther(ticketPrice) : '0'} ETH)`}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Manage Events Tab */}
          {activeTab === 'manage' && (
            <div className="bg-white rounded-lg shadow-md p-6 text-black">
              <h2 className="text-2xl font-semibold mb-4">⚙️ Manage Your Events</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Your Event</label>
                  <select
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="">Choose your event...</option>
                    {userContracts?.map((addr, idx) => (
                      <option key={idx} value={addr}>
                        {addr.slice(0, 6)}...{addr.slice(-4)}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedContract && isOwner && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Event Stats</h3>
                      <p><strong>Name:</strong> {contractName}</p>
                      <p><strong>Sold:</strong> {currentSupply?.toString()} tickets</p>
                      <p><strong>Max Supply:</strong> {maxSupply?.toString()}</p>
                      <p><strong>Status:</strong> {saleActive ? '🟢 Active' : '🔴 Paused'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">New Price (ETH)</label>
                        <div className="flex gap-2">
                          <input
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="flex-1 border rounded-lg p-2"
                            placeholder="0.01"
                          />
                          <button
                            onClick={updatePrice}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                          >
                            💰 Update
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={toggleSale}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium ${saleActive
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                        >
                          {saleActive ? '⏸️ Pause Sale' : '▶️ Start Sale'}
                        </button>
                        <button
                          onClick={withdrawFunds}
                          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
                        >
                          💸 Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedContract && !isOwner && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">⚠️ You can only manage events you created.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* My Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="bg-white rounded-lg shadow-md p-6 text-black">
              <h2 className="text-2xl font-semibold mb-4">🎟️ My Tickets</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Event</label>
                  <select
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="">Choose an event...</option>
                    {allContracts?.map((addr, idx) => (
                      <option key={idx} value={addr}>
                        {addr.slice(0, 6)}...{addr.slice(-4)}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedContract && userTickets && (
                  <div>
                    <h3 className="font-semibold mb-2">Your Tickets for {contractName}</h3>
                    {userTickets.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userTickets.map((tokenId) => (
                          <div key={tokenId.toString()} className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg p-4 text-white">
                            <h4 className="font-bold">🎫 Ticket #{tokenId.toString()}</h4>
                            <p className="text-sm opacity-90">{contractName}</p>
                            <p className="text-xs opacity-75">Valid Entry Ticket</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No tickets found for this event.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* All Events */}
          <div className="bg-white rounded-lg shadow-md p-6 text-black">
            <h3 className="text-lg font-semibold mb-4">🌟 All Events</h3>
            {isLoadingAll ? (
              <p className="text-gray-500">Loading events...</p>
            ) : allContracts && allContracts.length > 0 ? (
              <div className="space-y-2">
                {allContracts.slice(0, 5).map((addr, idx) => (
                  <div key={idx} className="bg-gray-50 rounded p-3">
                    <p className="font-mono text-sm">{addr.slice(0, 8)}...{addr.slice(-6)}</p>
                  </div>
                ))}
                {allContracts.length > 5 && (
                  <p className="text-sm text-gray-500">...and {allContracts.length - 5} more</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No events created yet.</p>
            )}
          </div>

          {/* Your Events */}
          {userAddress && (
            <div className="bg-white rounded-lg shadow-md p-6 text-black">
              <h3 className="text-lg font-semibold mb-4">👤 Your Events</h3>
              {isLoadingUser ? (
                <p className="text-gray-500">Loading your events...</p>
              ) : userContracts && userContracts.length > 0 ? (
                <div className="space-y-2">
                  {userContracts.map((addr, idx) => (
                    <div key={idx} className="bg-blue-50 rounded p-3">
                      <p className="font-mono text-sm">{addr.slice(0, 8)}...{addr.slice(-6)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">You haven't created any events yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}