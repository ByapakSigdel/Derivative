import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | Arduino Visual Scripting",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background transition-colors duration-300">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-4 text-card-foreground">Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
