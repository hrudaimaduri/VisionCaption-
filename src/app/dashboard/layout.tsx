import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-14 flex items-center border-b bg-card sticky top-0 z-50">
        <div className="flex font-bold text-lg tracking-tight items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground w-6 h-6 rounded-md flex items-center justify-center font-black text-xs">
              V
            </div>
            VISIONCAPTION<span className="text-primary">+</span>
          </Link>
        </div>
        <nav className="ml-8 flex gap-6 text-sm font-medium">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Workspace
          </Link>
          <Link href="/dashboard/history" className="text-muted-foreground hover:text-foreground transition-colors">
            History
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-muted-foreground">{session.user?.email}</div>
          <SignOutButton />
        </div>
      </header>
      
      <main className="flex-1 bg-muted/20">
        {children}
      </main>
    </div>
  );
}
