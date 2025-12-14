import { Clock, Zap, RefreshCw } from "lucide-react";
import type { Note } from "../../types";

interface NoteCardProps {
    note: Note;
    onArchive: (id: string, summary?: string) => void;
}

export function NoteCard({ note, onArchive }: NoteCardProps) {
    const intentIcons = {
        thinking: Zap,
        planning: Clock,
        building: RefreshCw,
        writing: RefreshCw,
        shared: RefreshCw,
    };

    const Icon = intentIcons[note.intent] || Zap;

    // Visual cues based on Aging (Opacity/Weight)
    const statusStyles = {
        alive: "text-gray-900 font-normal opacity-100",
        warming: "text-gray-600 font-light opacity-80",
        cooling: "text-gray-400 font-light opacity-60",
        archived: "hidden",
    };

    return (
        <div className={`group relative py-2 pl-4 pr-12 transition-all duration-700 animate-float-up`}>
            <div className="flex items-baseline gap-6 mx-auto max-w-3xl">

                {/* Content Column - Pure Text */}
                <div className="flex-1 min-w-0">
                    <div className={`text-lg leading-relaxed whitespace-pre-wrap ${statusStyles[note.status]} transition-colors duration-1000`}>
                        {note.content}
                    </div>
                </div>

                {/* Subtle Actions (Only on Hover) */}
                <div className="w-8 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div title={note.intent} className="text-gray-300">
                        <Icon className="w-3 h-3" />
                    </div>
                    <button
                        onClick={() => onArchive(note.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                        title="Archive"
                    >
                        <span className="text-xs">×</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
