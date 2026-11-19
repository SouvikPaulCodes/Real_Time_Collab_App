export default function Loading() {
    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14" aria-busy="true" aria-label="Loading documents">
            <div className="skeleton h-3 w-32"/>
            <div className="skeleton mt-3 h-11 w-72 max-w-full"/>
            <div className="skeleton mt-3 h-4 w-40"/>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({length: 4}, (_, i) => (
                    <div key={i} className="rounded-box border border-base-300 p-2">
                        <div className="skeleton h-36 rounded-field"/>
                        <div className="skeleton mx-2 mt-4 h-5 w-2/3"/>
                        <div className="skeleton mx-2 mt-2 mb-2 h-3 w-1/3"/>
                    </div>
                ))}
            </div>
        </main>
    )
}
