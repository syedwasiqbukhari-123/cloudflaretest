import { useState } from 'react';
import { Loader2, Brain, PenTool, Layout, Share2, MessageSquare } from 'lucide-react';
import type { NoteIntent } from '../../types';

interface ComposerProps {
    onCompose: (content: string, intent: NoteIntent) => Promise<void>;
    loading: boolean;
}

const INTENTS: { id: NoteIntent; label: string; icon: any }[] = [
    { id: 'thinking', label: 'Thinking', icon: Brain },
    { id: 'planning', label: 'Planning', icon: Layout },
    { id: 'building', label: 'Building', icon: PenTool },
    { id: 'writing', label: 'Writing', icon: MessageSquare },
    { id: 'shared', label: 'Shared', icon: Share2 },
];

export function Composer({ onCompose, loading }: ComposerProps) {
    const [content, setContent] = useState('');
    const [intent, setIntent] = useState<NoteIntent>('thinking');
    const [expanded, setExpanded] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        await onCompose(content, intent);
        setContent('');
        setExpanded(false);
    };

    return (
        <div className={`transition-all duration-300 ${expanded ? 'bg-gray-900 ring-1 ring-gray-700' : 'bg-gray-900/50'} rounded-2xl p-4 shadow-lg`}>
            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        setExpanded(true);
                    }}
                    onFocus={() => setExpanded(true)}
                    placeholder="Capture a thought..."
                    className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder-gray-500 min-h-[60px]"
                    rows={expanded ? 4 : 1}
                    disabled={loading}
                />

                {expanded && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800 animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-2">
                            {INTENTS.map((item) => {
                                const Icon = item.icon;
                                const isSelected = intent === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setIntent(item.id)}
                                        className={`p-2 rounded-lg transition-all ${isSelected
                                            ? 'bg-gray-700 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                                            }`}
                                        title={item.label}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !content.trim()}
                            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>Capture</span>
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
