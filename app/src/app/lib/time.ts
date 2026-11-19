const rtf = new Intl.RelativeTimeFormat('en', {numeric: 'auto'});

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 365 * 24 * 60 * 60],
    ['month', 30 * 24 * 60 * 60],
    ['week', 7 * 24 * 60 * 60],
    ['day', 24 * 60 * 60],
    ['hour', 60 * 60],
    ['minute', 60],
];

// "5 minutes ago", "yesterday", "3 weeks ago". Timezone-independent, so it's
// safe to render on the server.
export function timeAgo(iso: string, now = Date.now()) {
    const seconds = (new Date(iso).getTime() - now) / 1000;

    for(const [unit, size] of UNITS) {
        if(Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
    }

    return 'just now';
}
