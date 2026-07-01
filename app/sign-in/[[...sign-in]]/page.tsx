import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef0ef] px-5 py-16">
      <SignIn />
    </main>
  );
}
