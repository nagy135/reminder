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

interface IReminder {
  name: string;
  remindAt: Date;
  repeatPeriodicity: Periodicity;
}

export default function ReminderCard({
  reminder: { name, remindAt, repeatPeriodicity },
}: {
  reminder: IReminder;
}) {
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
        <Button variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
}
