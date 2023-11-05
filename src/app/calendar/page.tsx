import { currentUser } from "@clerk/nextjs";
import Calendar from "../_components/calendar";
import { api } from "~/trpc/server";
import { Reminder } from "~/types";

export default async function CalendarPage() {
  const user = await currentUser();
  if (!user) return <div>Not logged in</div>;

  const reminders = await api.reminder.getRemindersByUserId.query(user.id);

  return (
    <div className="m-2 flex justify-center pt-[150px]">
      <Calendar reminders={reminders as Reminder[]} />
    </div>
  );
}
