import { OrganizationList } from "@clerk/nextjs";

export default function Page() {
    
    return (<OrganizationList afterCreateOrganizationUrl={`/dashboard`} afterSelectOrganizationUrl={`/dashboard`} afterSelectPersonalUrl={`/dashboard`}/>)
}