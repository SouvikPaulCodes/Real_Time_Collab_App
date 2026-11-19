export default function Loading() {
    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col" aria-busy="true" aria-label="Loading document">
            <div className="shrink-0 border-b border-base-300 bg-base-100">
                <div className="flex items-center justify-between gap-4 px-3 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                        <div className="skeleton size-8"/>
                        <div className="skeleton h-8 w-64 max-w-[50vw]"/>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="skeleton size-8 rounded-full"/>
                        <div className="skeleton h-7 w-20 rounded-full"/>
                    </div>
                </div>
                <div className="flex justify-center gap-1.5 border-t border-base-300 px-2 py-2">
                    {Array.from({length: 12}, (_, i) => <div key={i} className="skeleton size-8"/>)}
                </div>
            </div>
            <div className="flex-1 overflow-hidden bg-base-200 px-3 py-6 sm:px-6 sm:py-10">
                <div className="mx-auto max-w-204 rounded-box border border-base-300 bg-base-100 px-6 py-10 sm:px-14 sm:py-14">
                    <div className="skeleton h-10 w-1/2"/>
                    <div className="mt-8 flex flex-col gap-3">
                        {[100, 96, 88, 100, 70].map((w, i) => <div key={i} className="skeleton h-4" style={{width: `${w}%`}}/>)}
                    </div>
                    <div className="skeleton mt-10 h-7 w-1/3"/>
                    <div className="mt-6 flex flex-col gap-3">
                        {[92, 100, 64].map((w, i) => <div key={i} className="skeleton h-4" style={{width: `${w}%`}}/>)}
                    </div>
                </div>
            </div>
        </div>
    )
}
