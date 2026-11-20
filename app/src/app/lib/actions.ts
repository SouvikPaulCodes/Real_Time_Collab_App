'use server'

import { auth, clerkClient } from '@clerk/nextjs/server';
import jwt from 'jsonwebtoken'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Message, Project } from "./definitions";

export async function getName(userId: string) {
    const client = await clerkClient()

    const user = await client.users.getUser(userId);

    return user?.firstName;
}

export async function createToken({id, orgId, userId}: {id?: string, orgId: string | undefined, userId: string}) { 
    const token = jwt.sign({userId, orgId: orgId ?? undefined, id}, process.env.JWT_SECRET!, {
        expiresIn: `${24}Hours`
    })

    return token;
}

export async function getProjects({orgId, userId}: {orgId: string | undefined, userId: string}) {
    const token: string = await createToken({orgId, userId});

    try {
        const payload = await fetch(`${process.env.EXPRESS_URL}/api/workspaces`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(!payload.ok) throw new Error()

        const data: Project[] = await payload.json();

        return data;
    }
    catch {
        const error = '500 - Failed to fetch projects';

        return error
    }
}

export async function createWorkspace(prevState: any) {
    const {userId, orgId} = await auth() as {
        userId: string,
        orgId: string | undefined
    }

    const token = await createToken({orgId, userId});

    let id: string;

    try {
        const res = await fetch(`${process.env.EXPRESS_URL}/api/workspaces`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(!res.ok) throw new Error(`Status ${res.status}`);

        ({id} = await res.json() as {id: string});
    }
    catch (e) {
        console.error('Failed to create workspace', e);
        return 'Failed to create workspace';
    }

    revalidatePath('/dashboard');

    redirect(`/workspace/${id}`)
}

export async function creatorProjects(projects: Project[] | undefined) {
    if(!projects) return;

    const named = projects.map(async project => {
        const firstName = await getName(project.userID);

        return {
            ...project,
            userName: firstName,
        }
    })

    const final = await Promise.all(named);

    return final;
}

export async function checkAuth(id: string, userId: string, orgId: string | undefined) {
    const data = await getProjects({orgId, userId});

    if(data === '500 - Failed to fetch projects') return '500 - Failed to fetch project';

    const project = data?.find(proj => proj.id === id);

    // redirect() works by throwing, so it has to stay outside any try/catch
    if(!project) redirect('/dashboard');

    return project;
}

export async function updateTitle(prevState: boolean | undefined, formData: FormData) {
    const id = formData.get('id');
    const title = formData.get('title');

    const {userId, orgId} = await auth() as {
        userId: string,
        orgId: string | undefined
    }

    const token = await createToken({orgId, userId});

    try {
        const res = await fetch(`${process.env.EXPRESS_URL}/api/workspaces/title`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({id, title}),
        })

        if(!res.ok) throw new Error('Couldnt change title');

        return true;
    }
    catch (e) {
        console.error('Failed to update title', e);
        return false;
    }
}

export async function getMessages(id: string, userId: string, orgId: string | undefined) {
    const token: string = await createToken({id, orgId, userId});

    try {
        const payload = await fetch(`${process.env.EXPRESS_URL}/api/messages`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(!payload.ok) throw new Error(`Status ${payload.status}`);

        const messages: Message[] = await payload.json();

        return messages;
    }
    catch(e: any) {
        console.error('Failed to fetch messages', e);
    }
}
