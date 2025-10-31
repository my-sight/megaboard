import { notFound } from "next/navigation";
import { BoardHub } from "@/components/boards/board-hub";
import { tenantRegistry } from "@/lib/utils/tenantRegistry";

export default function BoardsPage({ params }: { params: { tenant: string } }) {
  const tenant = tenantRegistry.find((item) => item.slug === params.tenant);
  if (!tenant) {
    notFound();
  }

  return <BoardHub tenant={tenant} />;
}
