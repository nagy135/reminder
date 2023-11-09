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
import { type Reminder } from "~/types";
import { useState } from "react";

export function EditAddReminderModal({
  reminder,
  preselectedDate,
  withoutButton,
  onClose,
}: {
  reminder?: Reminder;
  preselectedDate?: Date;
  withoutButton?: boolean;
  onClose?: (deletedId?: number, addedDate?: Date) => void;
}) {
  const [open, setOpen] = useState(withoutButton ? true : false);
  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        !e && onClose?.();
      }}
    >
      <DialogTrigger asChild>
        {!withoutButton ? (
          <Button variant="default" onClick={() => setOpen(true)}>
            {reminder ? "Edit" : "Add"}
          </Button>
        ) : null}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{reminder ? "Edit" : "Add"} reminder</DialogTitle>
          <DialogDescription>
            {"Make changes to your reminder here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <CreateEditReminder
          reminderToEdit={reminder}
          preselectedDate={preselectedDate}
          closeEditDialog={(deletedId?: number, addedDate?: Date) => {
            setOpen(false);
            onClose?.(deletedId, addedDate);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
