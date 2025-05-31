// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Script} from "forge-std/Script.sol";

abstract contract CodeConstants {
    uint256 internal constant ETH_SEPOLIA_CHAIN_ID = 11155111;
    uint256 internal constant ETH_MAINNET_CHAIN_ID = 1;
    uint256 internal constant ETH_ANVIL_CHAIN_ID = 31337;
    uint256 internal constant ETH_SCROLL_CHAIN_ID = 534351;
}

contract HelperConfig is Script, CodeConstants {
    error HelperConfig__InvalidChainId();
    NetworkConfig public activeConfig;

    struct NetworkConfig {
        uint256 deployerKey;
        string rpcUrl;
        uint256 chainId;
        string networkName;
    }

    uint256 public constant DEFAULT_ANVIL_KEY =
        0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    constructor() {
        if (block.chainid == ETH_SCROLL_CHAIN_ID) {
            activeConfig = getScrollConfig();
        } else if (block.chainid == ETH_SEPOLIA_CHAIN_ID) {
            activeConfig = getSepoliaConfig();
        } else if (block.chainid == ETH_MAINNET_CHAIN_ID) {
            activeConfig = getMainnetConfig();
        } else {
            activeConfig = getAnvilConfig();
        }
    }

    function getConfigByChainId(
        uint256 chainId
    ) public returns (NetworkConfig memory config) {
        if (chainId == ETH_SEPOLIA_CHAIN_ID) {
            return getSepoliaConfig();
        } else if (chainId == ETH_ANVIL_CHAIN_ID) {
            return getAnvilConfig();
        }
        if (block.chainid == ETH_SCROLL_CHAIN_ID) {
            return getScrollConfig();
        } else if (chainId == ETH_MAINNET_CHAIN_ID) {
            return getMainnetConfig();
        } else {
            revert HelperConfig__InvalidChainId();
        }
    }

    function getConfig() public returns (NetworkConfig memory config) {
        return getConfigByChainId(block.chainid);
    }

    function getScrollConfig() public view returns (NetworkConfig memory) {
        NetworkConfig memory sepoliaConfig = NetworkConfig({
            deployerKey: vm.envUint("PRIVATE_KEY"),
            rpcUrl: vm.envString("SCROLL_RPC_URL"),
            chainId: ETH_SCROLL_CHAIN_ID,
            networkName: "Scroll"
        });
        return sepoliaConfig;
    }

    function getSepoliaConfig() public view returns (NetworkConfig memory) {
        NetworkConfig memory sepoliaConfig = NetworkConfig({
            deployerKey: vm.envUint("PRIVATE_KEY"),
            rpcUrl: vm.envString("SEPOLIA_RPC_URL"),
            chainId: ETH_SEPOLIA_CHAIN_ID,
            networkName: "Sepolia"
        });
        return sepoliaConfig;
    }

    function getMainnetConfig() public view returns (NetworkConfig memory) {
        NetworkConfig memory mainnetConfig = NetworkConfig({
            deployerKey: vm.envUint("PRIVATE_KEY"),
            rpcUrl: vm.envString("MAINNET_RPC_URL"),
            chainId: ETH_MAINNET_CHAIN_ID,
            networkName: "Mainnet"
        });
        return mainnetConfig;
    }

    function getAnvilConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory anvilConfig = NetworkConfig({
            deployerKey: DEFAULT_ANVIL_KEY,
            rpcUrl: "http://localhost:8545",
            chainId: ETH_ANVIL_CHAIN_ID,
            networkName: "Anvil"
        });
        return anvilConfig;
    }
}
