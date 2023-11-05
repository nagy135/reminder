"use client";

import { Calendar as ShadcnCalendar } from "../_components/ui/calendar";
import useScreenWidth from "../hooks/use-screen-width";

export default function Calendar() {
  const windowSize = useScreenWidth();
  return (
    <ShadcnCalendar
      mode="single"
      numberOfMonths={windowSize !== null && windowSize > 400 ? 3 : 1}
      selected={new Date()}
      // onSelect={(e) => console.log(e)}
      // disabled={(date) => date < new Date()}
    />
  );
}
