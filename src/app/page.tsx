import { currentUser } from "@clerk/nextjs";

import { CreateReminder } from "./_components/create-reminder";

export default async function Home() {
  const user = await currentUser();
  if (!user) return <div>Not logged in</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Reminder
        </h1>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-bold tracking-tight sm:text-[2rem]">
            Hello {user?.firstName}
          </h3>
        </div>
        <CreateReminder />
      </div>
    </main>
  );
}
