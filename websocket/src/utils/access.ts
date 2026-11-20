import { prisma } from "./prisma.js";

type User = {
    userId: string,
    orgId?: string | undefined,
}

// Same rule the dashboard uses to list workspaces: org workspaces when an org is active,
// otherwise the user's personal ones
export function canAccess(workspace: {userID: string | null, orgID: string | null}, user: User) {
    return user.orgId
        ? workspace.orgID === user.orgId
        : workspace.userID === user.userId && workspace.orgID === null;
}

export async function findAccessibleWorkspace(id: string | undefined, user: User | undefined) {
    if(!id || !user) return null;

    const workspace = await prisma.workspace.findUnique({
        where: {id},
        select: {
            id: true,
            userID: true,
            orgID: true
        }
    })

    return workspace && canAccess(workspace, user) ? workspace : null;
}
