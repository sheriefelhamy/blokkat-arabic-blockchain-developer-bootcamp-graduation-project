import EventSelector from './EventSelector';

interface MyTicketsTabProps {
    selectedContract: string;
    setSelectedContract: (contract: string) => void;
    allContracts: readonly string[] | undefined;
    contractName: string | undefined;
    userTickets: readonly bigint[] | undefined;
}

export default function MyTicketsTab({
    selectedContract,
    setSelectedContract,
    allContracts,
    contractName,
    userTickets
}: MyTicketsTabProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-black">
            <h2 className="text-2xl font-semibold mb-4">🎟️ My Tickets</h2>
            <div className="space-y-4">
                <EventSelector
                    selectedContract={selectedContract}
                    setSelectedContract={setSelectedContract}
                    contracts={allContracts}
                />

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
    );
}