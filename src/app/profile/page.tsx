import { currentUser } from "@clerk/nextjs";
import { api } from "~/trpc/server";
import ReminderCard from "../_components/reminder-card";
import { Periodicity } from "~/enums";
import { Button } from "../_components/ui/button";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();
  if (!user) return <div>Not logged in</div>;

  const reminders = await api.reminder.getRemindersByUserId.query(user.id);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <Button variant="outline" className="absolute left-0 top-0 m-3">
        <Link href="/">Add reminder</Link>
      </Button>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Your reminders
        </h1>
        <div className="m-5 flex w-full flex-col gap-5 md:w-1/2">
          {reminders.map((e) => (
            <ReminderCard
              key={e.id}
              reminder={{
                id: e.id,
                userId: user.id,
                name: e.name,
                remindAt: e.remindAt,
                repeatPeriodicity: e.repeatPeriodicity as Periodicity,
                repeatIntervalSeconds: e.repeatIntervalSeconds,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
