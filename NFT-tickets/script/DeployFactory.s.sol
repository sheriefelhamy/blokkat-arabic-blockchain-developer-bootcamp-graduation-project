// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {Factory} from "../src/Factory.sol";
import {Tickets} from "../src/Tickets.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployFactory is Script {
    HelperConfig helperConfig;
    Factory factory;

    function run() external returns (Factory, address) {
        helperConfig = new HelperConfig();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();

        console.log("=== DEPLOYMENT STARTED ===");
        console.log("Deploying all contracts on", config.networkName);
        console.log("Chain ID:", config.chainId);
        console.log("Deployer Address:", vm.addr(config.deployerKey));

        vm.startBroadcast(config.deployerKey);

        // Deploy Factory
        factory = new Factory();
        console.log("Factory deployed at:", address(factory));

        vm.stopBroadcast();

        console.log("=== DEPLOYMENT COMPLETED ===");
        console.log("Factory Contract:", address(factory));
        console.log("You can now use the factory to deploy ticket contracts!");

        return (factory, address(factory));
    }
}
