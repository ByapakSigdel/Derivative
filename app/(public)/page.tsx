import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-4">Arduino Visual Scripting</h1>
      <p className="text-muted-foreground mb-8 max-w-xl text-center">
        Build Arduino programs visually, generate readable code, and upload directly from your browser.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="rounded-md bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 shadow transition-colors">Get Started</Link>
      </div>
    </main>
  );
}
