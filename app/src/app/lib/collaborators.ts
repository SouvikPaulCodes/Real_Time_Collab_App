// Each collaborator gets one of these colours, picked deterministically from
// their user id so they look the same to everyone and across sessions.
// Every entry keeps white label text readable and shows up on both themes.
export const COLLAB_COLORS = [
    '#E5484D', // vermilion
    '#D6409F', // raspberry
    '#8E4EC6', // grape
    '#3E63DD', // indigo
    '#0588F0', // azure
    '#0D9488', // teal
    '#2F9E44', // green
    '#E8590C', // tangerine
] as const;

export function colorFor(id: string) {
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) | 0;
    }

    return COLLAB_COLORS[Math.abs(hash) % COLLAB_COLORS.length];
}

export function initials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
