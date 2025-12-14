import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, StickyNote } from "lucide-react";
import type { Note } from "./types";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
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

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const newNote = await res.json() as Note;
        setNotes([newNote, ...notes]);
        setContent("");
      }
    } catch (error) {
      console.error("Failed to add note", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes(notes.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-gray-800">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center space-x-3 border-b border-gray-800 pb-6">
          <StickyNote className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold tracking-tight">Durable Notes</h1>
        </header>

        {/* Create Note Input */}
        <form onSubmit={addNote} className="relative group">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a thought..."
            className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-6 pr-16 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </form>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fetching ? (
            // Skeleton Loading
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-900/30 rounded-2xl animate-pulse border border-gray-800/50"
              />
            ))
          ) : notes.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-600">
              <p>No notes yet. Start writing...</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all hover:shadow-2xl hover:shadow-gray-900/50"
              >
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-300 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
