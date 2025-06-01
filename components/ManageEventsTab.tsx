import EventSelector from './EventSelector';

interface ManageEventsTabProps {
    selectedContract: string;
    setSelectedContract: (contract: string) => void;
    userContracts: readonly string[] | undefined;
    contractName: string | undefined;
    currentSupply: bigint | undefined;
    maxSupply: bigint | undefined;
    saleActive: boolean | undefined;
    isOwner: boolean;
    newPrice: string;
    setNewPrice: (price: string) => void;
    updatePrice: () => Promise<void>;
    toggleSale: () => Promise<void>;
    withdrawFunds: () => Promise<void>;
}

export default function ManageEventsTab({
    selectedContract,
    setSelectedContract,
    userContracts,
    contractName,
    currentSupply,
    maxSupply,
    saleActive,
    isOwner,
    newPrice,
    setNewPrice,
    updatePrice,
    toggleSale,
    withdrawFunds
}: ManageEventsTabProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-black">
            <h2 className="text-2xl font-semibold mb-4">⚙️ Manage Your Events</h2>
            <div className="space-y-4">
                <EventSelector
                    selectedContract={selectedContract}
                    setSelectedContract={setSelectedContract}
                    contracts={userContracts}
                    label="Select Your Event"
                    placeholder="Choose your event..."
                />

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
    );
}