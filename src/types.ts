export interface Note {
    id: string;
    content: string;
    createdAt: number; // timestamp
}

export type ApiResponse = {
    notes: Note[];
};
