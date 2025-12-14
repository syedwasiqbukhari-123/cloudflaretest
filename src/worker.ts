
import { DurableObject } from "cloudflare:workers";
import type { Note } from "./types";

interface Env {
    NOTES_DO: DurableObjectNamespace;
}

// Worker Entry Point
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname.startsWith("/api")) {
            // Route all API requests to a SINGLE Durable Object instance (Singleton for this demo)
            // In a real app, you might use different IDs for different users.
            const id = env.NOTES_DO.idFromName("global-notes-store");
            const stub = env.NOTES_DO.get(id);
            return stub.fetch(request);
        }

        // For everything else, let the Assets binding handle it (or return 404 if not found)
        // with 'assets' binding, the Worker is only invoked if the asset is missing
        return new Response("Not Found", { status: 404 });
    },
};

// Durable Object Class
export class NotesDO extends DurableObject {
    state: DurableObjectState;

    constructor(state: DurableObjectState, env: Env) {
        super(state, env);
        this.state = state;
    }

    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);

        // GET /api/notes - List all notes
        if (request.method === "GET" && url.pathname === "/api/notes") {
            const notesMap = await this.state.storage.list<Note>();
            const notes = (Array.from(notesMap.values()) as Note[]).sort((a, b) => b.createdAt - a.createdAt);
            return new Response(JSON.stringify({ notes }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // POST /api/notes - Create a note
        if (request.method === "POST" && url.pathname === "/api/notes") {
            const body = await request.json() as { content: string };
            const newNote: Note = {
                id: crypto.randomUUID(),
                content: body.content,
                createdAt: Date.now(),
            };
            await this.state.storage.put(newNote.id, newNote);
            return new Response(JSON.stringify(newNote), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // DELETE /api/notes/:id - Delete a note
        if (request.method === "DELETE" && url.pathname.startsWith("/api/notes/")) {
            const id = url.pathname.split("/").pop();
            if (id) {
                await this.state.storage.delete(id);
                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        return new Response("Method Not Allowed", { status: 405 });
    }
}
