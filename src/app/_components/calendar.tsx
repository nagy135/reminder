"use client";

import { useState } from "react";
import { Calendar as ShadcnCalendar } from "../_components/ui/calendar";
import useScreenWidth from "../hooks/use-screen-width";
import { type Reminder } from "~/types";
import { EditReminder } from "./edit-reminder";

export default function Calendar({ reminders }: { reminders: Reminder[] }) {
  const windowSize = useScreenWidth();
  const [days] = useState<Date[] | undefined>(reminders.map((e) => e.remindAt));
  const [reminderToEdit, setReminderToEdit] = useState<Reminder | undefined>(
    undefined,
  );

  return (
    <>
      <ShadcnCalendar
        mode="multiple"
        numberOfMonths={windowSize !== null && windowSize > 400 ? 3 : 1}
        showOutsideDays={false}
        selected={days}
        onSelect={undefined}
        onDayClick={(e) => {
          setReminderToEdit(
            reminders.find((r) => r.remindAt.getTime() === e.getTime()),
          );
        }}
      />
      {reminderToEdit && (
        <EditReminder
          reminder={reminderToEdit}
          withoutButton
          onClose={() => setReminderToEdit(undefined)}
        />
      )}
    </>
  );
}
