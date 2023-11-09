"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditAddReminderModal } from "./edit-add-reminder-modal";
import { type Reminder } from "~/types";

export default function ReminderCard({ reminder }: { reminder: Reminder }) {
  const { name, remindAt, repeatPeriodicity, userId, id } = reminder;
  const [deleted, setDeleted] = useState(false);
  const router = useRouter();
  const deleteReminder = api.reminder.deleteReminderById.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onMutate: () => {
      setDeleted(true);
    },
  });

  return (
    <Card
      style={{
        transition: "all .8s",
        opacity: deleted ? "0" : "1",
        visibility: deleted ? "hidden" : "visible",
      }}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{repeatPeriodicity}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{format(remindAt, "PPP")}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <EditAddReminderModal reminder={reminder} />

        <Button
          onClick={() => deleteReminder.mutate({ id: id, userId: userId })}
          variant="destructive"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
