interface EventDetailsProps {
    contractName: string | undefined;
    ticketPrice: bigint | undefined;
    currentSupply: bigint | undefined;
    maxSupply: bigint | undefined;
    saleActive: boolean | undefined;
    formatEther: (wei: bigint) => string;
}

export default function EventDetails({
    contractName,
    ticketPrice,
    currentSupply,
    maxSupply,
    saleActive,
    formatEther
}: EventDetailsProps) {
    return (
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
    );
}