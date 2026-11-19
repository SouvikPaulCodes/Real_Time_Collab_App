export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <main className="flex justify-center px-4 py-10 sm:py-16">
            {children}
        </main>
    )
}
