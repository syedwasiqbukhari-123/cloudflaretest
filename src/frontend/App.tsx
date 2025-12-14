import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { Note, NoteIntent } from "../types";
import { Composer } from "./components/Composer";
import { NoteCard } from "./components/NoteCard";
import { Sidebar } from "./components/Sidebar";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeSpace, setActiveSpace] = useState('main');

  useEffect(() => {
    fetchNotes(activeSpace);
  }, [activeSpace]);

  const fetchNotes = async (space: string) => {
    setFetching(true);
    try {
      const res = await fetch(`/api/notes?space=${space}`);
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
        body: JSON.stringify({ content, intent, space: activeSpace }),
      });
      if (res.ok) {
        const newNote = await res.json() as Note;
        // In Chat Style, Newest is at BOTTOM.
        // Our API sorts Newest First (Desc).
        // Frontend State: [Newest (0), Older (1), ...]
        // Render: flex-col-reverse -> Bottom = Item 0.
        // So we add new note to START of array.
        setNotes([newNote, ...notes]);
      }
    } catch (error) {
      console.error("Failed to create note", error);
    } finally {
      setLoading(false);
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

  const activeStream = notes.filter(n => n.status !== 'archived');
  // We can show cooling notes in stream, they just fade.
  // Archived are totally hidden in this view (or we could have an archive toggle elsewhere, but keeping it simple as per prompt).

  return (
    <div className="flex h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-gray-200 overflow-hidden">

      {/* Sidebar */}
      <Sidebar activeSpace={activeSpace} onSpaceChange={setActiveSpace} />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative max-w-4xl mx-auto w-full">

        {/* Stream (Flex Reverse for Bottom Up) */}
        <div className="flex-1 flex flex-col-reverse overflow-y-auto px-4 md:px-12 py-8 space-y-reverse space-y-6 scrollbar-hide">

          {fetching ? (
            <div className="flex justify-center py-20 opacity-0 animate-pulse delay-500">
              <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
            </div>
          ) : activeStream.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 opacity-0 animate-in fade-in duration-1000">
              <p className="font-light text-gray-300 text-sm tracking-widest uppercase">Space Empty</p>
            </div>
          ) : (
            activeStream.map(note => (
              <NoteCard key={note.id} note={note} onArchive={handleArchive} />
            ))
          )}

          {/* Top Spacer */}
          <div className="h-32 flex-shrink-0" />
        </div>

        {/* Input Area (Anchored Bottom) */}
        <div className="p-4 md:p-12 md:pb-16 bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent z-10 transition-colors duration-500">
          <Composer onCompose={handleCompose} loading={loading} />
        </div>

      </main>
    </div>
  );
}

export default App;
