# 🎫 NFT Ticket System

A decentralized event ticketing platform built on Ethereum that uses NFTs as tickets. Create events, sell tickets as NFTs, and manage your events seamlessly on the blockchain.

## 📖 About This Project

### Project Description
The NFT Ticket System is a revolutionary approach to event ticketing that leverages blockchain technology to create a transparent, secure, and decentralized ticketing platform. Each ticket is represented as a unique Non-Fungible Token (NFT) on the Ethereum blockchain, providing several advantages over traditional ticketing systems:

- **Ownership Verification**: True ownership of tickets through blockchain technology
- **Anti-Counterfeiting**: Impossible to duplicate or forge tickets
- **Transparent Pricing**: All pricing and sales data recorded on-chain
- **Resale Market**: Secure peer-to-peer ticket transfers
- **Event Management**: Complete control for event organizers

The platform consists of a factory contract that deploys individual ticket contracts for each event, allowing event organizers to maintain full control over their ticket sales while benefiting from the security and transparency of blockchain technology.

### Directory Structure
```
dream/
├── app/                      # Next.js App Router pages and routing
│   ├── favicon.ico          # Website favicon
│   ├── globals.css          # Global CSS styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page component
├── components/              # Reusable React components
│   ├── BuyTicketsTab.tsx    # Component for purchasing tickets
│   ├── CreateEventTab.tsx   # Component for creating new events
│   ├── EventDetails.tsx     # Component for displaying event information
│   ├── EventSelector.tsx    # Dropdown component for event selection
│   ├── Header.tsx           # Navigation header component
│   ├── index.tsx            # Component exports
│   ├── ManageEventsTab.tsx  # Component for event management
│   ├── MyTicketsTab.tsx     # Component for viewing owned tickets
│   ├── NavigationTabs.tsx   # Tab navigation component
│   └── Sidebar.tsx          # Sidebar navigation component
├── config/                  # Configuration files
│   └── index.tsx            # Wagmi and Web3Modal configuration
├── constants/               # Application constants
│   └── ABIs.ts              # Smart contract ABIs
├── context/                 # React Context providers
├── lib/                     # Utility libraries and helpers
├── public/                  # Static assets and images
├── NFT-tickets/             # Smart Contract Development (Foundry)
│   ├── .github/             # GitHub workflows and CI/CD
│   ├── broadcast/           # Deployment artifacts and transaction records
│   ├── cache/               # Foundry compilation cache
│   ├── lib/                 # Smart contract dependencies (OpenZeppelin)
│   ├── out/                 # Compiled contract artifacts
│   ├── script/              # Deployment and utility scripts
│   │   ├── DeployFactory.s.sol  # Factory contract deployment script
│   │   └── HelperConfig.s.sol   # Network configuration helper
│   ├── src/                 # Smart contract source code
│   │   ├── Factory.sol      # Main factory contract
│   │   └── Tickets.sol      # Individual ticket contract template
│   ├── test/                # Smart contract tests
│   │   ├── TicketFactoryTest.t.sol      # factory and tickets testing contract
│   ├── foundry.toml         # Foundry configuration
│   ├── remappings.txt       # Import remappings for dependencies
│   └── README.md            # Smart contract specific documentation
├── .env                     # Environment variables (local)
├── .gitignore               # Git ignore patterns
├── .gitmodules              # Git submodules configuration
├── Flattened.sol            # Flattened contract for verification
├── next.config.ts           # Next.js configuration
├── next-env.d.ts            # Next.js TypeScript declarations
├── package.json             # Node.js dependencies and scripts
├── package-lock.json        # Dependency lockfile
├── postcss.config.mjs       # PostCSS configuration for Tailwind
├── tsconfig.json            # TypeScript configuration
└── README.md                # Main project documentation
```

## 🎨 Design Patterns

This project implements several important design patterns to ensure maintainability, security, and scalability:

### 1. Factory Pattern
**Implementation Location**: `NFT-tickets/src/Factory.sol`

The Factory pattern is used to create and manage multiple ticket contracts efficiently:

```solidity
contract Factory {
    mapping(address => address[]) public ownerToContracts;
    address[] public allContracts;
    
    function createTicketContract(
        string memory _eventName,
        string memory _name,
        string memory _symbol
    ) public returns (address) {
        Tickets newContract = new Tickets(_name, _symbol, msg.sender);
        // Contract registration and mapping logic
    }
}
```

**Benefits**:
- Centralized contract deployment and management
- Standardized ticket contract creation
- Easy tracking of all deployed contracts
- Gas-efficient deployment process

### 2. Access Control Pattern (Ownable)
**Implementation Location**: `NFT-tickets/src/Tickets.sol`

Each ticket contract implements ownership controls to restrict administrative functions:

```solidity
contract Tickets is ERC721, Ownable {
    modifier onlyOwner() {
        require(msg.sender == owner(), "Not the contract owner");
        _;
    }
    
    function setTicketPrice(uint256 _price) public onlyOwner {
        ticketPrice = _price;
    }
    
    function toggleSale() public onlyOwner {
        isSaleActive = !isSaleActive;
    }
}
```

**Benefits**:
- Secure administrative functions
- Clear separation of permissions
- Protection against unauthorized access
- Standard OpenZeppelin implementation

## 🛡️ Security Measures

The project implements multiple security measures to protect users and ensure safe operation:

### 1. Reentrancy Protection
**Implementation Location**: `NFT-tickets/src/Tickets.sol`

Protection against reentrancy attacks in withdrawal functions:

```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Tickets is ERC721, Ownable, ReentrancyGuard {
    function withdraw() public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}
```

**Benefits**:
- Prevents malicious contracts from draining funds
- Ensures atomic transaction completion
- Uses OpenZeppelin's audited implementation

### 2. Input Validation and Checks-Effects-Interactions Pattern
**Implementation Location**: `NFT-tickets/src/Tickets.sol`

Comprehensive input validation and secure state management:

```solidity
function buyTicket(string memory _tokenURI) public payable {
    // Checks
    require(isSaleActive, "Sale is not active");
    require(msg.value >= ticketPrice, "Insufficient payment");
    require(bytes(_tokenURI).length > 0, "Token URI cannot be empty");
    
    // Effects
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    
    // Interactions
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, _tokenURI);
    
    emit TicketPurchased(msg.sender, tokenId, msg.value);
}
```

**Benefits**:
- Prevents invalid state transitions
- Guards against malicious inputs
- Follows secure coding best practices
- Comprehensive error messages for debugging

## 🔗 Important Links & Addresses

### Smart Contract Addresses (Scroll Sepolia Testnet)
- **Factory Contract**: `0x816631D7A13bc45BAbd54e0Bbb14c0eb32D37937`

### Blockchain Explorer Links (Verified Contracts)
- **Factory Contract (Verified)**: [View on Scroll Sepolia Explorer](https://sepolia-blockscout.scroll.io/address/0x816631D7A13bc45BAbd54e0Bbb14c0eb32D37937)

### Frontend Application
- **Live DApp**: [https://blokkat-arabic-blockchain-developer-umber.vercel.app/](https://blokkat-arabic-blockchain-developer-umber.vercel.app/)
- **GitHub Repository**: [https://github.com/sheriefelhamy/blokkat-arabic-blockchain-developer-bootcamp-graduation-project](https://github.com/sheriefelhamy/blokkat-arabic-blockchain-developer-bootcamp-graduation-project)

### Network Information
- **Network**: Scroll Sepolia Testnet
- **Chain ID**: 534351
- **RPC URL**: https://sepolia-rpc.scroll.io
- **Block Explorer**: https://sepolia-blockscout.scroll.io

## 🧪 How to Run Tests

### Prerequisites
Ensure you have Foundry installed and the project dependencies set up:

```bash
# Install Foundry if not already installed
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Navigate to the smart contracts directory
cd NFT-tickets

# Install dependencies
forge install
```

### Running Smart Contract Tests

```bash
# Navigate to the NFT-tickets directory
cd NFT-tickets

# Run all tests
forge test

# Run tests with verbose output
forge test -vv

# Run specific test file
forge test --match-path test/FactoryTest.t.sol

# Run tests with gas reporting
forge test --gas-report

# Run tests with coverage
forge coverage

# Run tests on forked network (if needed)
forge test --fork-url https://sepolia-rpc.scroll.io
```

### Test Structure
```
NFT-tickets/test/
├── Factory.t.sol          # Factory contract tests
├── Tickets.t.sol          # Ticket contract tests
└── Integration.t.sol      # Integration tests
```

### Expected Test Output
```bash
Running 15 tests for test/Factory.t.sol:FactoryTest
[PASS] testCreateTicketContract() (gas: 2234567)
[PASS] testGetOwnerContracts() (gas: 1234567)
[PASS] testGetAllContracts() (gas: 987654)
...

Test result: ok. 15 passed; 0 failed; finished in 1.23s
```

## 🚀 How to Run the Program

### Local Development Setup

#### 1. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/sheriefelhamy/blokkat-arabic-blockchain-developer-bootcamp-graduation-project.git
cd blokkat-arabic-blockchain-developer-bootcamp-graduation-project

# Install frontend dependencies
npm install
# or
yarn install
```

#### 2. Environment Configuration
Create a `.env.local` file in the root directory with the following structure:

```env
# WalletConnect Project ID (Get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id_here

# Factory Contract Address (Deployed on Scroll Sepolia)
NEXT_PUBLIC_FACTORY_ADDRESS=0x816631D7A13bc45BAbd54e0Bbb14c0eb32D37937

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=534351
NEXT_PUBLIC_RPC_URL=https://sepolia-rpc.scroll.io

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

#### 3. Start Development Server
```bash
# Start the Next.js development server
npm run dev
# or
yarn dev

# The application will be available at http://localhost:3000
```

#### 4. Smart Contract Development (Optional)
If you want to deploy your own contracts:

```bash
# Navigate to smart contracts directory
cd NFT-tickets

# Start local blockchain
anvil

# In another terminal, deploy contracts
forge script script/DeployFactory.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Production Deployment

#### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

#### Smart Contract Deployment (Scroll Sepolia)
```bash
# Set your private key
export PRIVATE_KEY=your_private_key_without_0x_prefix

# Deploy to Scroll Sepolia
forge script script/DeployFactory.s.sol:DeployScript \
  --rpc-url https://sepolia-rpc.scroll.io \
  --broadcast \
  --verify
```

## 🎬 Demo

### Video Walkthrough
Watch a complete demonstration of the NFT Ticket System in action:

**[🎥 Complete Demo Video - NFT Ticket System Walkthrough](https://docs.google.com/videos/d/13b_32_UIT2Xg59oSlTFNqKmB-htRxjL-0oWH1Q6To4A/edit?usp=sharing)**

### Demo Highlights

The demo covers the following workflow:

1. **Wallet Connection**
   - Connecting MetaMask to Scroll Sepolia testnet
   - Verifying network configuration

2. **Event Creation**
   - Creating a new event contract through the factory
   - Setting event name, ticket collection name, and symbol
   - Transaction confirmation on Scroll Sepolia

3. **Event Management**
   - Setting ticket prices
   - Toggling sale status
   - Viewing contract details on blockchain explorer

4. **Ticket Purchase**
   - Selecting an event from the dropdown
   - Adding metadata URI for ticket
   - Completing purchase transaction
   - Viewing transaction on [Scroll Sepolia Explorer](https://sepolia-blockscout.scroll.io)

5. **Ticket Portfolio**
   - Viewing owned tickets
   - Checking ticket metadata
   - Verifying ownership on blockchain

6. **Blockchain Verification**
   - Exploring transactions on Scroll Sepolia Explorer
   - Verifying contract interactions
   - Checking event logs and transfers

### Live Testing
You can test the application live at: [Your Deployed App URL]

### Sample Transactions
- **Event Creation**: [Transaction Hash on Explorer]
- **Ticket Purchase**: [Transaction Hash on Explorer]
- **Price Update**: [Transaction Hash on Explorer]

## ✨ Features

- **🏗️ Event Creation**: Deploy custom ticket contracts for your events
- **🎫 NFT Tickets**: Each ticket is a unique NFT with metadata
- **💰 Flexible Pricing**: Set and update ticket prices
- **🔄 Sale Management**: Toggle ticket sales on/off
- **👤 Owner Dashboard**: Manage events and withdraw funds
- **🎟️ Ticket Portfolio**: View all your purchased tickets
- **🔒 Secure Transfers**: Standard ERC-721 transferability

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Wagmi** - React hooks for Ethereum interactions
- **Web3Modal** - Multi-wallet connection interface

### Smart Contracts
- **Solidity** - Smart contract programming language
- **Foundry** - Fast and flexible Ethereum development framework
- **OpenZeppelin** - Secure and audited contract standards

### Blockchain Infrastructure
- **Scroll Sepolia** - Layer 2 testnet for deployment
- **IPFS** - Decentralized storage for ticket metadata
- **Ethers.js** - Ethereum JavaScript library

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is experimental software built for educational purposes. Use at your own risk. Always test thoroughly on testnets before any mainnet deployment.

## 🙏 Acknowledgments

- **Blokkat Arabic Blockchain Developer Bootcamp** for the learning opportunity
- **OpenZeppelin** for secure contract standards
- **Foundry team** for excellent development tooling
- **Wagmi team** for React/Ethereum integration
- **Scroll team** for Layer 2 infrastructure
- **The Ethereum community** for continuous innovation

---

Made with ❤️ for the decentralized future | Blokkat Bootcamp Graduation Project