"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Periodicity } from "~/enums";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

interface IReminder {
  id: number;
  userId: string;
  name: string;
  remindAt: Date;
  repeatPeriodicity: Periodicity;
}

export default function ReminderCard({
  reminder: { name, remindAt, repeatPeriodicity, userId, id },
}: {
  reminder: IReminder;
}) {
  const router = useRouter();
  const deleteReminder = api.reminder.deleteReminderById.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{repeatPeriodicity}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{format(remindAt, "PPP")}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
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
