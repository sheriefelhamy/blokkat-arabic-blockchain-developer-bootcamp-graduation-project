# 🎫 NFT Ticket System

A decentralized event ticketing platform built on Ethereum that uses NFTs as tickets. Create events, sell tickets as NFTs, and manage your events seamlessly on the blockchain.

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
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wagmi** - Ethereum interactions
- **Web3Modal** - Wallet connections

### Smart Contracts
- **Solidity** - Smart contract language
- **Foundry** - Development framework
- **OpenZeppelin** - Contract standards

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Git
- Foundry (for smart contracts)
- MetaMask or compatible wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sheriefelhamy/blokkat-arabic-blockchain-developer-bootcamp-graduation-project.git
   cd blokkat-arabic-blockchain-developer-bootcamp-graduation-project
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Foundry (if not already installed)**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

4. **Install smart contract dependencies**
   ```bash
   cd NFT-tickets
   forge install
   ```

### Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment variables**
   ```env
   NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_FACTORY_ADDRESS=0x816631D7A13bc45BAbd54e0Bbb14c0eb32D37937
   ```

### Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Smart Contract Deployment

### Local Development

1. **Start Anvil (local blockchain)**
   ```bash
   cd NFT-tickets
   anvil
   ```

2. **Deploy contracts**
   ```bash
   forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast
   ```

### Testnet Deployment

1. **Configure your private key**
   ```bash
   export PRIVATE_KEY=your_private_key
   ```

2. **Deploy to testnet**
   ```bash
   forge script script/Deploy.s.sol:DeployScript --rpc-url https://sepolia-rpc.scroll.io --broadcast --verify
   ```

## 🎯 How to Use

### Creating an Event

1. Connect your wallet
2. Navigate to "Create Event" tab
3. Fill in event details:
   - Event name
   - Ticket collection name
   - Ticket symbol
4. Click "Create Event Contract"
5. Confirm the transaction

### Buying Tickets

1. Go to "Buy Tickets" tab
2. Select an event from the dropdown
3. Enter metadata URI for your ticket
4. Click "Buy Ticket"
5. Pay the required amount in ETH

### Managing Events (Event Owners Only)

1. Visit "Manage Events" tab
2. Select your event
3. Available actions:
   - Update ticket price
   - Toggle sale status
   - Withdraw funds

### Viewing Your Tickets

1. Go to "My Tickets" tab
2. Select an event
3. View all your tickets for that event

## 🏗️ Project Structure

```
nft-ticket-system/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application component
│   └── layout.tsx         # Root layout
├── NFT-tickets/           # Smart contracts
│   ├── src/               # Contract source code
│   ├── test/              # Contract tests
│   ├── script/            # Deployment scripts
│   └── foundry.toml       # Foundry configuration
├── context/               # React contexts
├── lib/                   # Utility libraries
├── public/                # Static assets
└── config/                # Configuration files
```

## 🔧 Smart Contract Architecture

### Factory Contract
- Deploys individual ticket contracts
- Tracks all deployed contracts
- Maps contracts to owners

### Ticket Contract (ERC-721)
- Inherits from OpenZeppelin's ERC721
- Manages ticket sales and pricing
- Tracks ticket usage and transfers
- Owner-only administrative functions

## 🧪 Testing

### Frontend Tests
```bash
npm run test
```

### Smart Contract Tests
```bash
cd NFT-tickets
forge test
```

### Run Tests with Coverage
```bash
forge coverage
```

## 📊 Contract Addresses

### Mainnet
- Factory Contract: `TBD`

### Sepolia Testnet
- Factory Contract: `0x816631D7A13bc45BAbd54e0Bbb14c0eb32D37937`

## 🛡️ Security Considerations

- All contracts use OpenZeppelin's audited implementations
- Owner-only functions are protected with access controls
- Proper input validation on all user inputs
- Reentrancy guards on financial functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](docs/)
- [Smart Contract Source](NFT-tickets/src/)
- [Live Demo](https://your-demo-url.com)

## ⚠️ Disclaimer

This is experimental software. Use at your own risk. Always test thoroughly on testnets before mainnet deployment.

## 🙏 Acknowledgments

- OpenZeppelin for secure contract standards
- Foundry team for excellent tooling
- Wagmi for React/Ethereum integration
- The Ethereum community for continuous innovation

---

Made with ❤️ for the decentralized future