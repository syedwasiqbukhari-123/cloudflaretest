import { useState, useRef } from 'react';
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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        await onCompose(content, intent);
        setContent('');
        // Restore focus immediately after submission completes and disabled state lifts
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    return (
        <div className="max-w-3xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-x-0 -top-12 flex justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                    {INTENTS.map((item) => {
                        const Icon = item.icon;
                        const isSelected = intent === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setIntent(item.id)}
                                className={`p-1.5 rounded-full transition-all border border-gray-200 bg-white ${isSelected
                                    ? 'text-black border-gray-400 bg-gray-100 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                title={item.label}
                            >
                                <Icon className="w-3 h-3" />
                            </button>
                        );
                    })}
                </div>

                <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl p-2 transition-all shadow-sm focus-within:shadow-md focus-within:border-gray-300">
                    <textarea
                        ref={textareaRef}
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
                        placeholder="Type a thought..."
                        className="w-full bg-transparent border-none focus:ring-0 text-base placeholder-gray-400 resize-none min-h-[44px] max-h-[200px] py-2 px-3 text-gray-900"
                        rows={1}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="p-2 mr-1 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors disabled:opacity-0"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4 bg-black rounded-full" />}
                    </button>
                </div>
            </form>
        </div>
    );
}
