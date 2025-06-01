interface NavigationTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function NavigationTabs({ activeTab, setActiveTab }: NavigationTabsProps) {
    const tabs = [
        { id: 'create', label: '🏗️ Create Event' },
        { id: 'buy', label: '🎫 Buy Tickets' },
        { id: 'manage', label: '⚙️ Manage Events' },
        { id: 'tickets', label: '🎟️ My Tickets' }
    ];

    return (
        <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-md ${activeTab === tab.id
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}