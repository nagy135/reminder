import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { CreateEditReminder } from "./create-edit-reminder";
import { Reminder } from "~/types";
import { useState } from "react";

export function EditReminder({ reminder }: { reminder: Reminder }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit reminder</DialogTitle>
          <DialogDescription>
            Make changes to your reminder here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <CreateEditReminder
          reminderToEdit={reminder}
          closeEditDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
