import { Archive, Clock, Zap, RefreshCw } from "lucide-react";
import type { Note } from "../../types";

interface NoteCardProps {
    note: Note;
    onArchive: (id: string, summary?: string) => void;
}

export function NoteCard({ note, onArchive }: NoteCardProps) {
    // Visual cues based on status
    const statusStyles = {
        alive: "border-l-4 border-l-green-500 bg-gray-900",
        warming: "border-l-4 border-l-yellow-500 bg-gray-900/80 grayscale-[30%]",
        cooling: "border-l-4 border-l-blue-500 bg-gray-900/60 grayscale-[60%]",
        archived: "hidden", // Should not render usually
    };

    const intentIcons = {
        thinking: Zap,
        planning: Clock,
        building: RefreshCw, // fallback
        writing: RefreshCw,
        shared: RefreshCw,
    };

    const Icon = intentIcons[note.intent] || Zap;

    return (
        <div className={`group relative p-6 rounded-xl border border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1 ${statusStyles[note.status]}`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500 font-medium">
                    <Icon className="w-3 h-3" />
                    <span>{note.intent} • {note.status}</span>
                </div>
                <button
                    onClick={() => onArchive(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-white transition-opacity"
                    title="Archive Thought"
                >
                    <Archive className="w-4 h-4" />
                </button>
            </div>

            <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap font-light">
                {note.content}
            </p>

            <div className="mt-4 text-xs text-gray-600 flex justify-end">
                {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    );
}
