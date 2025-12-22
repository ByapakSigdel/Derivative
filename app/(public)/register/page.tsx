import { redirect } from "next/navigation";

export const metadata = {
  title: "Register Disabled",
};

export default function RegisterPage() {
  redirect("/login");
}
