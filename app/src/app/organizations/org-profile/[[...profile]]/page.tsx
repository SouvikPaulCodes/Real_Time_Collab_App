import { OrganizationProfile } from "@clerk/nextjs";

export default function Page() {
    return (<OrganizationProfile afterLeaveOrganizationUrl="/dashboard"/>)
}