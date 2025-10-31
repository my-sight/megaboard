import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-static";

export default async function MarketingPage() {
  const filePath = path.join(process.cwd(), "public", "index.html");
  const html = await fs.readFile(filePath, "utf8");

  return (
    <div
      className="min-h-screen bg-surface"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
