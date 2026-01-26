import Tiptap from "@/app/components/TipTap";
import { auth } from "@clerk/nextjs/server";
import { checkAuth, createToken, getMessages, getName } from "@/app/lib/actions";
import { notFound } from "next/navigation";

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const {isAuthenticated, redirectToSignIn, orgId, userId} = await auth();
    const {id} = await params;

    if(!isAuthenticated) return redirectToSignIn();

    const fullname = await getName(userId);

    const project = await checkAuth(id, userId, orgId)

    if(project === '500 - Failed to fetch project') notFound();

    const token = await createToken({orgId, userId})

    const messages = await getMessages(id, userId, orgId);

    return (
        <Tiptap fullname={fullname!} token={token} docName={id} name={project?.name} messages={messages} userId={userId}/>
    )
}