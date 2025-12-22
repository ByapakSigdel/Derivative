import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | Arduino Visual Scripting",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
