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

export function EditReminder({
  reminder,
  withoutButton,
  onClose,
}: {
  reminder: Reminder;
  withoutButton?: boolean;
  onClose?: () => void;
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
            Edit
          </Button>
        ) : null}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit reminder</DialogTitle>
          <DialogDescription>
            {"Make changes to your reminder here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <CreateEditReminder
          reminderToEdit={reminder}
          closeEditDialog={() => {
            setOpen(false);
            onClose?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
