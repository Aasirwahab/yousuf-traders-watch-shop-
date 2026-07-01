import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef0ef] px-5 py-16">
      <SignUp />
    </main>
  );
}
