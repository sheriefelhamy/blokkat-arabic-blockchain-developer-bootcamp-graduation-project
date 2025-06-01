interface EventSelectorProps {
    selectedContract: string;
    setSelectedContract: (contract: string) => void;
    contracts: readonly string[] | undefined;
    label?: string;
    placeholder?: string;
}

export default function EventSelector({
    selectedContract,
    setSelectedContract,
    contracts,
    label = "Select Event",
    placeholder = "Choose an event..."
}: EventSelectorProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <select
                value={selectedContract}
                onChange={(e) => setSelectedContract(e.target.value)}
                className="w-full border rounded-lg p-3"
            >
                <option value="">{placeholder}</option>
                {contracts?.map((addr, idx) => (
                    <option key={idx} value={addr}>
                        {addr.slice(0, 6)}...{addr.slice(-4)}
                    </option>
                ))}
            </select>
        </div>
    );
}