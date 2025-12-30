import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/login");
  }
  return (
    <section className="min-h-screen bg-background">
      {children}
    </section>
  );
}
