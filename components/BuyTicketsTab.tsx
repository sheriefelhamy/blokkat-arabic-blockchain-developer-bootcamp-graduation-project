import EventSelector from './EventSelector';
import EventDetails from './EventDetails';

interface BuyTicketsTabProps {
    selectedContract: string;
    setSelectedContract: (contract: string) => void;
    allContracts: readonly string[] | undefined;
    contractName: string | undefined;
    ticketPrice: bigint | undefined;
    currentSupply: bigint | undefined;
    maxSupply: bigint | undefined;
    saleActive: boolean | undefined;
    userAddress: string | undefined;
    formatEther: (wei: bigint) => string;
    tokenURI: string;
    setTokenURI: (uri: string) => void;
    isMinting: boolean;
    mintTicket: () => Promise<void>;
}

export default function BuyTicketsTab({
    selectedContract,
    setSelectedContract,
    allContracts,
    contractName,
    ticketPrice,
    currentSupply,
    maxSupply,
    saleActive,
    userAddress,
    formatEther,
    tokenURI,
    setTokenURI,
    isMinting,
    mintTicket
}: BuyTicketsTabProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-black">
            <h2 className="text-2xl font-semibold mb-4">🎫 Buy Tickets</h2>
            <div className="space-y-4">
                <EventSelector
                    selectedContract={selectedContract}
                    setSelectedContract={setSelectedContract}
                    contracts={allContracts}
                />

                {selectedContract && (
                    <>
                        <EventDetails
                            contractName={contractName}
                            ticketPrice={ticketPrice}
                            currentSupply={currentSupply}
                            maxSupply={maxSupply}
                            saleActive={saleActive}
                            formatEther={formatEther}
                        />

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
    );
}