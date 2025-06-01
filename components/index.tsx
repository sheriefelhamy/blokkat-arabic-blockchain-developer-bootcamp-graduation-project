'use client'

import { useWriteContract, useReadContract, useAccount } from "wagmi";
import React, { useState } from "react";
import { FACTORYABI, TICKETABI } from "../constants/ABIs";
import Header from "./Header";
import NavigationTabs from "./NavigationTabs";
import CreateEventTab from "./CreateEventTab";
import BuyTicketsTab from "./BuyTicketsTab";
import ManageEventsTab from "./ManageEventsTab";
import MyTicketsTab from "./MyTicketsTab";
import Sidebar from "./Sidebar";

export default function TicketSystem() {
    const FACTORYADDRESS = "0x816631D7A13bc45BAbd54e0Bbb14c0eb32D37937" as `0x${string}`;

    const { writeContract } = useWriteContract();
    const { address: userAddress } = useAccount();

    // State for active tab
    const [activeTab, setActiveTab] = useState('create');

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

    // Fetch all deployed contracts - typed as string array
    const { data: allContracts, isLoading: isLoadingAll } = useReadContract({
        address: FACTORYADDRESS,
        abi: FACTORYABI,
        functionName: 'getDeployedContracts',
    }) as { data: string[] | undefined, isLoading: boolean };

    // Fetch user's contracts - typed as string array
    const { data: userContracts, isLoading: isLoadingUser } = useReadContract({
        address: FACTORYADDRESS,
        abi: FACTORYABI,
        functionName: 'getContractsByOwner',
        args: userAddress ? [userAddress] : undefined,
    }) as { data: string[] | undefined, isLoading: boolean };

    // Get contract name for selected contract - typed as string
    const { data: contractName } = useReadContract({
        address: FACTORYADDRESS,
        abi: FACTORYABI,
        functionName: 'contractNames',
        args: selectedContract ? [selectedContract as `0x${string}`] : undefined,
    }) as { data: string | undefined };

    // Get ticket details for selected contract - typed as bigint
    const { data: ticketPrice } = useReadContract({
        address: selectedContract as `0x${string}`,
        abi: TICKETABI,
        functionName: 'ticketPrice',
        query: { enabled: !!selectedContract }
    }) as { data: bigint | undefined };

    const { data: currentSupply } = useReadContract({
        address: selectedContract as `0x${string}`,
        abi: TICKETABI,
        functionName: 'getCurrentTokenId',
        query: { enabled: !!selectedContract }
    }) as { data: bigint | undefined };

    const { data: maxSupply } = useReadContract({
        address: selectedContract as `0x${string}`,
        abi: TICKETABI,
        functionName: 'maxSupply',
        query: { enabled: !!selectedContract }
    }) as { data: bigint | undefined };

    const { data: saleActive } = useReadContract({
        address: selectedContract as `0x${string}`,
        abi: TICKETABI,
        functionName: 'saleActive',
        query: { enabled: !!selectedContract }
    }) as { data: boolean | undefined };

    const { data: contractOwner } = useReadContract({
        address: selectedContract as `0x${string}`,
        abi: TICKETABI,
        functionName: 'owner',
        query: { enabled: !!selectedContract }
    }) as { data: string | undefined };

    const { data: userTickets } = useReadContract({
        address: selectedContract as `0x${string}`,
        abi: TICKETABI,
        functionName: 'getTokensByOwner',
        args: userAddress ? [userAddress] : undefined,
        query: { enabled: !!selectedContract && !!userAddress }
    }) as { data: bigint[] | undefined };

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
                value: ticketPrice,
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

    const isOwner = contractOwner && userAddress && contractOwner === userAddress;

    // Properly typed shared props
    const sharedProps = {
        selectedContract,
        setSelectedContract,
        allContracts: allContracts as readonly string[] | undefined,
        userContracts: userContracts as readonly string[] | undefined,
        contractName: contractName as string | undefined,
        ticketPrice: ticketPrice as bigint | undefined, // Keep as bigint for components
        currentSupply: currentSupply as bigint | undefined, // Keep as bigint for components
        maxSupply: maxSupply as bigint | undefined, // Keep as bigint for components
        saleActive: saleActive as boolean | undefined,
        userAddress,
        formatEther,
        isOwner: !!isOwner, // Convert to boolean (required by ManageEventsTab)
        userTickets: userTickets as bigint[] | undefined
    };

    return (
        <main className="max-w-6xl mx-auto p-6">
            <Header />

            <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {activeTab === 'create' && (
                        <CreateEventTab
                            name={name}
                            setName={setName}
                            symbol={symbol}
                            setSymbol={setSymbol}
                            eventName={eventName}
                            setEventName={setEventName}
                            isDeploying={isDeploying}
                            deployContract={deployContract}
                            userAddress={userAddress}
                        />
                    )}

                    {activeTab === 'buy' && (
                        <BuyTicketsTab
                            {...sharedProps}
                            tokenURI={tokenURI}
                            setTokenURI={setTokenURI}
                            isMinting={isMinting}
                            mintTicket={mintTicket}
                        />
                    )}

                    {activeTab === 'manage' && (
                        <ManageEventsTab
                            {...sharedProps}
                            newPrice={newPrice}
                            setNewPrice={setNewPrice}
                            updatePrice={updatePrice}
                            toggleSale={toggleSale}
                            withdrawFunds={withdrawFunds}
                        />
                    )}

                    {activeTab === 'tickets' && (
                        <MyTicketsTab {...sharedProps} />
                    )}
                </div>

                {/* Sidebar */}
                <Sidebar
                    allContracts={allContracts}
                    userContracts={userContracts}
                    isLoadingAll={isLoadingAll}
                    isLoadingUser={isLoadingUser}
                    userAddress={userAddress}
                />
            </div>
        </main>
    );
}