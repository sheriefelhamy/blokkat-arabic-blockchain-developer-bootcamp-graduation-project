export default function Header() {
    return (
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">🎫 Ticket System</h1>
            <div className="flex gap-4 justify-center mb-4">
                <w3m-button />
                <w3m-network-button />
            </div>
        </div>
    );
}