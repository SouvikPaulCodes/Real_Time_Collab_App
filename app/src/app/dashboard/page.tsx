import { auth, clerkClient } from "@clerk/nextjs/server"
import type { Organization } from "@clerk/nextjs/server";
import { getProjects, getName, creatorProjects } from "../lib/actions";
import NewWorkspace from "../components/newWorkspace";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page() {
    const {isAuthenticated, redirectToSignIn, orgId, userId} = await auth();

    if(!isAuthenticated) return redirectToSignIn();

    const client = await clerkClient();
    let org: Organization | undefined

    if(orgId) org = await client.organizations.getOrganization({organizationId: orgId})
    
    const projects = await getProjects({orgId, userId});

    if(projects === '500 - Failed to fetch projects') notFound()

    const createProjects = await creatorProjects(projects)

    return (
        <div className="flex flex-col min-h-screen">
            <h1 className="p-4 text-4xl">{org ? `${org.name}'s ` : `Personal `}Dashboard</h1>
            <div className="grid grid-cols-[2fr_10fr] bg-base-100 h-full grow border-t-base-content border-t-2">
                <div></div>
                <div className="p-4">
                    <div>
                        <NewWorkspace/>
                    </div>
                    <div className="previous">
                        <h2>Previous Projects</h2>
                        <div className="flex flex-wrap gap-4">
                            {
                                createProjects?.map(project => {
                                    return (
                                        <Link key={project.id} href={`/workspace/${project.id}`}>
                                            <div className="p-3 bg-base-100">
                                                <h3>{project.name}</h3>
                                                <div>Created by {project.userName}</div>
                                                <div>Last updated at {project.updatedAt.split('T')[1].split('.')[0]} on {project.updatedAt.split('T')[0]}</div>
                                            </div>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    )
}