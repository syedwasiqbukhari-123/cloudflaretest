import { Home, Briefcase, Lightbulb, User, Clock } from 'lucide-react';

interface SidebarProps {
    activeSpace: string;
    onSpaceChange: (space: string) => void;
}

const SPACES = [
    { id: 'main', label: 'Stream', icon: Home },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb },
    { id: 'personal', label: 'Personal', icon: User },
];

export function Sidebar({ activeSpace, onSpaceChange }: SidebarProps) {
    return (
        <div className="w-16 md:w-64 border-r border-gray-900 flex flex-col items-center md:items-stretch py-8 bg-black">
            <div className="mb-8 px-0 md:px-6 flex justify-center md:justify-start">
                <div className="bg-white p-2 text-black rounded-lg">
                    <Clock className="w-5 h-5" />
                </div>
            </div>
            <nav className="space-y-2 px-2 md:px-4">
                {SPACES.map((space) => {
                    const Icon = space.icon;
                    const isActive = activeSpace === space.id;

                    return (
                        <button
                            key={space.id}
                            onClick={() => onSpaceChange(space.id)}
                            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl transition-all ${isActive
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'
                                }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="hidden md:block font-medium">{space.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto px-4 hidden md:block">
                <p className="text-xs text-gray-700 text-center">Durable v3.0</p>
            </div>
        </div>
    );
}
