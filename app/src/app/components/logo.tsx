import { COLLAB_COLORS } from "../lib/collaborators";

// A page with two collaborators' carets on it.
export default function Logo({className}: {className?: string}) {
    return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
            <rect x="3" y="3" width="21" height="26" rx="4.5" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 10h11M8 16h6M8 22h9" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round"/>

            <g stroke="var(--color-base-100)" strokeWidth="1.5" paintOrder="stroke">
                <rect x="16" y="12" width="2" height="8" rx="1" fill={COLLAB_COLORS[0]}/>
                <rect x="16" y="10" width="9" height="4" rx="1.5" fill={COLLAB_COLORS[0]}/>

                <rect x="20" y="18" width="2" height="8" rx="1" fill={COLLAB_COLORS[4]}/>
                <rect x="20" y="16" width="9" height="4" rx="1.5" fill={COLLAB_COLORS[4]}/>
            </g>
        </svg>
    )
}
