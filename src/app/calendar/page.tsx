import { currentUser } from "@clerk/nextjs";
import Calendar from "../_components/calendar";
import { api } from "~/trpc/server";
import ProfileNavigation from "../_components/profile-navigation";

export default async function CalendarPage() {
  const user = await currentUser();
  if (!user) return <div>Not logged in</div>;

  const reminders = await api.reminder.getRemindersByUserId.query(user.id);

  return (
    <div className="flex min-h-screen flex-col items-center">
      <ProfileNavigation list={true} />
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Calendar
        </h1>
        <div className="m-5">
          <Calendar reminders={reminders} />
        </div>
      </div>
    </div>
  );
}
