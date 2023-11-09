"use client";

import { useState } from "react";
import { Calendar as ShadcnCalendar } from "../_components/ui/calendar";
import useScreenWidth from "../hooks/use-screen-width";
import { type Reminder } from "~/types";
import { EditAddReminderModal } from "./edit-add-reminder-modal";
import { useRouter } from "next/navigation";

const numberOfMonths = (size: number): number => {
  if (size > 850) return 3;
  else if (size > 650) return 2;
  else return 1;
};

export default function Calendar({ reminders }: { reminders: Reminder[] }) {
  const windowSize = useScreenWidth();
  const router = useRouter();
  const [days, setDays] = useState<Date[]>(reminders.map((e) => e.remindAt));
  const [reminderToEdit, setReminderToEdit] = useState<Reminder | undefined>(
    undefined,
  );

  const [preselectedDate, setPreselectedDate] = useState<Date | undefined>(
    undefined,
  );

  return (
    <>
      <ShadcnCalendar
        mode="multiple"
        numberOfMonths={windowSize !== null ? numberOfMonths(windowSize) : 1}
        showOutsideDays={false}
        selected={days}
        onSelect={undefined}
        onDayClick={(e) => {
          const matchedDate = reminders.find(
            (r) => r.remindAt.toDateString() === e.toDateString(),
          );
          if (matchedDate) setReminderToEdit(matchedDate);
          else setPreselectedDate(e);
        }}
      />
      {(preselectedDate || reminderToEdit) && (
        <EditAddReminderModal
          reminder={reminderToEdit}
          preselectedDate={preselectedDate}
          withoutButton
          onClose={(deletedId?: number, addedDate?: Date) => {
            setReminderToEdit(undefined);
            setPreselectedDate(undefined);
            if (deletedId) {
              reminders = reminders.filter((e) => e.id !== deletedId);
              setDays(reminders.map((e) => e.remindAt));
              router.refresh();
            } else if (addedDate && days) {
              setDays((days) => [...days, addedDate]);
              router.refresh();
            }
          }}
        />
      )}
    </>
  );
}
