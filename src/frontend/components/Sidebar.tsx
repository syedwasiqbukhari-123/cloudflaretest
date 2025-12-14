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
        <div className="w-16 md:w-64 flex flex-col items-center md:items-stretch py-12 bg-transparent transition-opacity duration-500">
            <div className="mb-12 px-0 md:px-8 flex justify-center md:justify-start">
                <div className="text-gray-400 opacity-50 hover:opacity-100 transition-opacity">
                    <Clock className="w-6 h-6" />
                </div>
            </div>
            <nav className="space-y-4 px-2 md:px-6">
                {SPACES.map((space) => {
                    const Icon = space.icon;
                    const isActive = activeSpace === space.id;

                    return (
                        <button
                            key={space.id}
                            onClick={() => onSpaceChange(space.id)}
                            className={`w-full flex items-center justify-center md:justify-start gap-4 p-2 rounded-lg transition-all duration-300 ${isActive
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                            <span className="hidden md:block text-base tracking-wide">{space.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
