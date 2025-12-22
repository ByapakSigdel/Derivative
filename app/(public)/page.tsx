import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white text-gray-900">
      <h1 className="text-4xl font-bold mb-4">Arduino Visual Scripting</h1>
      <p className="text-gray-600 mb-8 max-w-xl text-center">
        Build Arduino programs visually, generate readable code, and upload directly from your browser.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="rounded-md bg-black text-white px-5 py-2 text-sm font-medium hover:bg-gray-800">Get Started</Link>
      </div>
    </main>
  );
}
