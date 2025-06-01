interface SidebarProps {
    allContracts: readonly string[] | undefined;
    userContracts: readonly string[] | undefined;
    isLoadingAll: boolean;
    isLoadingUser: boolean;
    userAddress: string | undefined;
}

export default function Sidebar({
    allContracts,
    userContracts,
    isLoadingAll,
    isLoadingUser,
    userAddress
}: SidebarProps) {
    return (
        <div className="space-y-6">
            {/* All Events */}
            <div className="bg-white rounded-lg shadow-md p-6 text-black">
                <h3 className="text-lg font-semibold mb-4">🌟 All Events</h3>
                {isLoadingAll ? (
                    <p className="text-gray-500">Loading events...</p>
                ) : allContracts && allContracts.length > 0 ? (
                    <div className="space-y-2">
                        {allContracts.slice(0, 5).map((addr, idx) => (
                            <div key={idx} className="bg-gray-50 rounded p-3">
                                <p className="font-mono text-sm">{addr.slice(0, 8)}...{addr.slice(-6)}</p>
                            </div>
                        ))}
                        {allContracts.length > 5 && (
                            <p className="text-sm text-gray-500">...and {allContracts.length - 5} more</p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500">No events created yet.</p>
                )}
            </div>

            {/* Your Events */}
            {userAddress && (
                <div className="bg-white rounded-lg shadow-md p-6 text-black">
                    <h3 className="text-lg font-semibold mb-4">👤 Your Events</h3>
                    {isLoadingUser ? (
                        <p className="text-gray-500">Loading your events...</p>
                    ) : userContracts && userContracts.length > 0 ? (
                        <div className="space-y-2">
                            {userContracts.map((addr, idx) => (
                                <div key={idx} className="bg-blue-50 rounded p-3">
                                    <p className="font-mono text-sm">{addr.slice(0, 8)}...{addr.slice(-6)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You haven't created any events yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}