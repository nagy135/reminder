"use client";

import { useState } from "react";
import { Calendar as ShadcnCalendar } from "../_components/ui/calendar";
import useScreenWidth from "../hooks/use-screen-width";
import { Reminder } from "~/types";

export default function Calendar({ reminders }: { reminders: Reminder[] }) {
  const windowSize = useScreenWidth();
  const [days] = useState<Date[] | undefined>(reminders.map((e) => e.remindAt));

  return (
    <ShadcnCalendar
      mode="multiple"
      numberOfMonths={windowSize !== null && windowSize > 400 ? 3 : 1}
      selected={days}
      onSelect={undefined}
      // onSelect={(e) => console.log(e)}
      // disabled={(date) => date < new Date()}
    />
  );
}
