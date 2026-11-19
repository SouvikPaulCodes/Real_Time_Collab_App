import Link from "next/link";
import { colorFor, initials } from "../lib/collaborators";
import { timeAgo } from "../lib/time";

// Line widths for the thumbnail, varied per document so the grid doesn't look stamped out.
function previewLines(id: string) {
    let hash = 0;
    for(let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;

    return Array.from({length: 5}, (_, i) => 55 + (Math.abs(hash >> (i * 3)) % 40));
}

export default function ProjectCard({id, name, userID, userName, updatedAt}: {id: string, name: string, userID: string, userName: string | null | undefined, updatedAt: string}) {
    const color = colorFor(userID);
    const lines = previewLines(id);
    const creator = userName || 'Someone';

    return (
        <Link href={`/workspace/${id}`} className="group flex flex-col rounded-box border border-base-300 bg-base-100 p-2 transition hover:-translate-y-0.5 hover:border-base-content/20 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <div className="h-36 overflow-hidden rounded-field bg-base-200 px-6 pt-5" aria-hidden="true">
                <div className="h-full rounded-t-md border border-b-0 border-base-300 bg-base-100 px-4 pt-4">
                    <div className="h-2 w-1/2 rounded-full bg-base-content/60"/>
                    <div className="mt-3 flex flex-col gap-1.5">
                        {lines.map((width, i) => (
                            <div key={i} className="flex items-center gap-0.5">
                                <div className="h-1.5 rounded-full bg-base-300" style={{width: `${i === 2 ? width - 25 : width}%`}}/>
                                {i === 2 &&
                                    <div className="relative h-3 w-0.5 rounded-full group-hover:animate-pulse" style={{backgroundColor: color}}>
                                        <div className="absolute -top-1.5 left-0 h-1.5 w-3 rounded-sm" style={{backgroundColor: color}}/>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-start gap-3 px-2 pt-3 pb-1.5">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-2xl leading-tight">{name || 'Untitled'}</h3>
                    <p className="mt-1 truncate text-xs text-base-content/55">
                        Edited <time dateTime={updatedAt}>{timeAgo(updatedAt)}</time>
                    </p>
                </div>
                <div className="tooltip tooltip-left" data-tip={`Created by ${creator}`}>
                    <div className="grid size-7 place-items-center rounded-full text-[0.65rem] font-semibold text-white select-none" style={{backgroundColor: color}} aria-label={`Created by ${creator}`}>
                        {initials(creator)}
                    </div>
                </div>
            </div>
        </Link>
    )
}
