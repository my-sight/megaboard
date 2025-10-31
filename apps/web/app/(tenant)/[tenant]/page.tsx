import { redirect } from "next/navigation";

export default function TenantIndex({ params }: { params: { tenant: string } }) {
  redirect(`/${params.tenant}/overview`);
}
