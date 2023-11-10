import { currentUser } from "@clerk/nextjs";

import { CreateEditReminder } from "./_components/create-edit-reminder";
import Navigation from "./_components/navigation";
import { Page } from "~/enums";

export default async function HomePage() {
  const user = await currentUser();
  if (!user) return <div>Not logged in</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <Navigation currentPage={Page.home} />
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          reminder
        </h1>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-bold tracking-tight sm:text-[2rem]">
            Hello {user?.firstName}
          </h3>
        </div>
        <CreateEditReminder />
      </div>
    </main>
  );
}
