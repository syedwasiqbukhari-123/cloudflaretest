import { useState, useEffect } from "react";
import { Loader2, Archive, Wind, Activity } from "lucide-react";
import type { Note, NoteIntent } from "../types";
import { Composer } from "./components/Composer";
import { NoteCard } from "./components/NoteCard";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json() as { notes: Note[] };
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Failed to fetch notes", error);
    } finally {
      setFetching(false);
    }
  };

  const handleCompose = async (content: string, intent: NoteIntent) => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, intent }), // Backend auth middleware handles userId injection, but we passed it in body in index.ts logic.
        // Wait, index.ts logic said: "Clone request to inject userId". So we don't need to send it from frontend if AuthMiddleware was real.
        // But currently AuthMiddleware returns "dev-user-001".
        // Let's rely on backend injection.
      });
      if (res.ok) {
        const newNote = await res.json() as Note;
        setNotes([newNote, ...notes]);
      }
    } catch (error) {
      console.error("Failed to create note", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string, summary?: string) => {
    // Optimistic update
    setNotes(notes.map(n => n.id === id ? { ...n, status: 'archived' } : n));

    try {
      await fetch(`/api/notes/${id}/archive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });
      // Re-fetch to get any server-side state updates (decay calculation)
      // Actually, let's just stick with optimistic for snappiness.
    } catch (error) {
      console.error("Failed to archive note", error);
      fetchNotes(); // Revert on error
    }
  };

  // Filter Logic
  const activeStream = notes.filter(n => n.status === 'alive' || n.status === 'warming');
  const archiveStream = notes.filter(n => n.status === 'cooling' || n.status === 'archived');

  // Sort: active by intent/time? No, "relevance and recent activity".
  // NoteStore returns them sorted by updatedAt desc. We'll keep that.

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20 space-y-12">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gray-900 ${fetching ? 'animate-pulse' : ''}`}>
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-medium tracking-tight text-white">Durable Notes</h1>
          </div>

          <button
            onClick={() => setShowArchive(!showArchive)}
            className={`p-2 rounded-full transition-colors ${showArchive ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-400'}`}
            title="Toggle Archive"
          >
            <Archive className="w-5 h-5" />
          </button>
        </header>

        {/* Composer */}
        <section>
          <Composer onCompose={handleCompose} loading={loading} />
        </section>

        {/* Active Stream */}
        <section className="space-y-6">
          {fetching && notes.length === 0 ? (
            <div className="flex justify-center py-20 text-gray-800">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : activeStream.length === 0 && !fetching ? (
            <div className="text-center py-20 text-gray-600">
              <Wind className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-light">Mind clear. Ready for thoughts.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {activeStream.map(note => (
                <NoteCard key={note.id} note={note} onArchive={handleArchive} />
              ))}
            </div>
          )}
        </section>

        {/* Archive / Cooling Stream */}
        {showArchive && (
          <section className="pt-12 border-t border-gray-900 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-sm font-medium text-gray-500 mb-6 uppercase tracking-widest pl-1">
              Fading & Archived
            </h2>
            <div className="grid gap-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
              {archiveStream.length === 0 ? (
                <p className="text-gray-700 italic pl-1">No history yet.</p>
              ) : (
                archiveStream.map(note => (
                  <NoteCard key={note.id} note={note} onArchive={handleArchive} />
                ))
              )}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default App;
