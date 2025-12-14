import { useState, useEffect } from "react";
import { Loader2, Wind } from "lucide-react";
import type { Note, NoteIntent } from "../types";
import { Composer } from "./components/Composer";
import { Bubble } from "./components/Bubble";
import { NoteOverlay } from "./components/NoteOverlay";
import { Sidebar } from "./components/Sidebar";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeSpace, setActiveSpace] = useState('main');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes(activeSpace);
  }, [activeSpace]);

  const fetchNotes = async (space: string) => {
    setFetching(true);
    try {
      const res = await fetch(`/api/notes?space=${space}`);
      if (res.ok) {
        const data = await res.json() as { notes: Note[] };
        // API returns Newest First (Desc).
        // For Bubble Field (filling from top or bottom?), "Slides into current row" at bottom implies
        // the "Active Edge" is at the bottom.
        // So we want the list to end at the bottom.
        // We sort Oldest -> Newest.
        const sorted = (data.notes || []).sort((a, b) => a.createdAt - b.createdAt);
        setNotes(sorted);
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
        body: JSON.stringify({ content, intent, space: activeSpace }),
      });
      if (res.ok) {
        const newNote = await res.json() as Note;
        setNotes(prev => [...prev, newNote]); // Append to end (Bottom)
      }
    } catch (error) {
      console.error("Failed to create note", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, content: string) => {
    // Optimistic
    setNotes(notes.map(n => n.id === id ? { ...n, content } : n));

    try {
      await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
    } catch (err) {
      fetchNotes(activeSpace); // revert on fail
    }
  };

  const handleArchive = async (id: string, summary?: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, status: 'archived' } : n));
    try {
      await fetch(`/api/notes/${id}/archive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });
    } catch (error) {
      fetchNotes(activeSpace);
    }
  };

  // Only show active notes (Alive/Warming/Cooling)
  const activeBubbles = notes.filter(n => n.status !== 'archived');

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans selection:bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <Sidebar activeSpace={activeSpace} onSpaceChange={setActiveSpace} />

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col relative w-full h-full">

        {/* Bubble Field */}
        {/* 'content-end' aligns the wrapped rows to the bottom of the container */}
        {/* 'items-end' aligns items within the row to the bottom (good for variable height) */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 scrollbar-hide flex flex-col justify-end">

          <div className="w-full max-w-3xl mx-auto flex flex-wrap items-end content-end gap-3 pb-4 min-h-0">
            {fetching ? (
              <div className="w-full flex justify-center py-20 opacity-30">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : activeBubbles.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 opacity-40 text-gray-300">
                <Wind className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-light tracking-wide">Mind clear. Ready for thoughts.</p>
              </div>
            ) : (
              activeBubbles.map(note => (
                <Bubble key={note.id} note={note} onClick={setSelectedNote} />
              ))
            )}
          </div>

        </div>

        {/* Input Area (Anchored Bottom) */}
        <div className="px-6 md:px-12 pb-8 pt-4 bg-gradient-to-t from-white via-white/90 to-transparent z-10 w-full max-w-5xl mx-auto">
          <Composer onCompose={handleCompose} loading={loading} />
        </div>

      </main>

      {/* Overlay */}
      {selectedNote && (
        <NoteOverlay
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdate={handleUpdate}
          onArchive={handleArchive}
        />
      )}

    </div>
  );
}

export default App;
