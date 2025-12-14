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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        await onCompose(content, intent);
        setContent('');
    };

    return (
        <div className="max-w-3xl mx-auto w-full group">
            <form onSubmit={handleSubmit} className="relative">
                <div className="absolute inset-x-0 -top-16 flex justify-center gap-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-500 ease-in-out translate-y-4 focus-within:translate-y-0 group-hover:translate-y-0">
                    {INTENTS.map((item) => {
                        const Icon = item.icon;
                        const isSelected = intent === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setIntent(item.id)}
                                className={`p-2 rounded-full transition-all duration-300 ${isSelected
                                    ? 'text-gray-900 bg-gray-100'
                                    : 'text-gray-300 hover:text-gray-500'
                                    }`}
                                title={item.label}
                            >
                                <Icon className="w-4 h-4" />
                            </button>
                        );
                    })}
                </div>

                <div className="relative flex items-end gap-2 p-2">
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (content.trim()) handleSubmit(e);
                            }
                        }}
                        placeholder="Thought..."
                        className="w-full bg-transparent border-none focus:ring-0 text-xl font-light placeholder-gray-300 resize-none min-h-[50px] max-h-[200px] py-2 px-0 text-gray-900 caret-gray-400"
                        rows={1}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="pb-3 text-gray-300 hover:text-gray-900 transition-colors disabled:opacity-0"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-current mb-1.5" />}
                    </button>
                </div>
            </form>
        </div>
    );
}
