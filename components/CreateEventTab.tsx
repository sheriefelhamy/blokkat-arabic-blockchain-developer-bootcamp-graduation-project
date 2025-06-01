interface CreateEventTabProps {
    name: string;
    setName: (name: string) => void;
    symbol: string;
    setSymbol: (symbol: string) => void;
    eventName: string;
    setEventName: (eventName: string) => void;
    isDeploying: boolean;
    deployContract: () => Promise<void>;
    userAddress: string | undefined;
}

export default function CreateEventTab({
    name,
    setName,
    symbol,
    setSymbol,
    eventName,
    setEventName,
    isDeploying,
    deployContract,
    userAddress
}: CreateEventTabProps) {
    return (
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
    );
}