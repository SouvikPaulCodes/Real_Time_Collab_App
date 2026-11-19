import { auth, clerkClient } from "@clerk/nextjs/server"
import type { Organization } from "@clerk/nextjs/server";
import { getProjects, creatorProjects } from "../lib/actions";
import NewWorkspace from "../components/newWorkspace";
import ProjectCard from "../components/projectCard";
import Logo from "../components/logo";
import { notFound } from "next/navigation";

export default async function Page() {
    const {isAuthenticated, redirectToSignIn, orgId, userId} = await auth();

    if(!isAuthenticated) return redirectToSignIn();

    const client = await clerkClient();
    let org: Organization | undefined

    if(orgId) org = await client.organizations.getOrganization({organizationId: orgId, includeMembersCount: true})

    const projects = await getProjects({orgId, userId});

    if(projects === '500 - Failed to fetch projects') notFound()

    const createProjects = (await creatorProjects(projects) ?? [])
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">{org ? 'Team workspace' : 'Personal workspace'}</p>
                    <h1 className="mt-1 font-serif text-4xl sm:text-5xl">{org ? org.name : 'Your documents'}</h1>
                    <p className="mt-2 text-sm text-base-content/60">
                        {createProjects.length === 0 ? 'Nothing here yet' : `${createProjects.length} ${createProjects.length === 1 ? 'document' : 'documents'}`}
                        {org?.membersCount && ` · shared with ${org.membersCount} ${org.membersCount === 1 ? 'member' : 'members'}`}
                    </p>
                </div>
                {createProjects.length > 0 && <NewWorkspace/>}
            </div>

            {createProjects.length === 0 ?
                <div className="mt-12 flex flex-col items-center rounded-box border border-dashed border-base-300 px-6 py-16 text-center">
                    <Logo className="size-14"/>
                    <h2 className="mt-5 font-serif text-3xl">Start your first document</h2>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-base-content/60">
                        {org ? `Anything you create here is shared with everyone in ${org.name}.` : 'Documents you create here are private to you. Switch to a team to write together.'}
                    </p>
                    <div className="mt-6">
                        <NewWorkspace/>
                    </div>
                </div>
                :
                <section className="mt-10" aria-labelledby="recent-heading">
                    <h2 id="recent-heading" className="mb-4 text-sm font-medium text-base-content/60">Recently edited</h2>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <NewWorkspace variant="card"/>
                        {createProjects.map(project => (
                            <ProjectCard key={project.id} id={project.id} name={project.name} userID={project.userID} userName={project.userName} updatedAt={project.updatedAt}/>
                        ))}
                    </div>
                </section>
            }
        </main>
    )
}
