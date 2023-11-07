"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/app/_components/ui/button";
import { Progress } from "~/app/_components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { useRef, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useToast } from "./ui/use-toast";
import { Periodicity } from "~/enums";
import { type Reminder } from "~/types";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "Please select a name",
    })
    .min(1, { message: "You must enter a name" })
    .max(256, { message: "Name too long" })
    .describe("Name"),
  remindAt: z.date({
    required_error: "Please select date of event",
  }),
  repeatPeriodicity: z.nativeEnum(Periodicity, {
    required_error: "Please select periodicity",
  }),
  customRepeatPeriodicity: z.coerce.number().optional(),
});

type CreateEditReminder = {
  reminderToEdit?: Reminder;
  closeEditDialog?: (deletedId?: number) => void;
};
export function CreateEditReminder({
  reminderToEdit,
  closeEditDialog,
}: CreateEditReminder) {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [customPeriodicity, setCustomPeriodicity] = useState(
    reminderToEdit?.repeatPeriodicity === Periodicity.custom,
  );
  const [progress, setProgress] = useState(0);
  const progressTimeoutHandle = useRef<NodeJS.Timeout>();

  const updateReminder = api.reminder.updateReminder.useMutation({
    onMutate: () => {
      setProgress(33);
      progressTimeoutHandle.current = setTimeout(() => {
        setProgress(55);
      }, 200);
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: JSON.stringify(e.data?.zodError?.fieldErrors),
      });
      clearTimeout(progressTimeoutHandle.current);
      setProgress(0);
    },
    onSuccess: () => {
      setProgress(88);
      setTimeout(() => {
        router.refresh();
        toast({
          title: "Updated successfully",
          description: "Reminder has been updated",
        });
        setProgress(0);
        closeEditDialog?.();
        form.reset();
      }, 1000);
    },
  });
  const createReminder = api.reminder.createReminder.useMutation({
    onMutate: () => {
      setProgress(33);
      progressTimeoutHandle.current = setTimeout(() => {
        setProgress(55);
      }, 200);
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Create failed",
        description: JSON.stringify(e.data?.zodError?.fieldErrors),
      });
      clearTimeout(progressTimeoutHandle.current);
      setProgress(0);
    },
    onSuccess: () => {
      setProgress(88);
      setTimeout(() => {
        router.refresh();
        toast({
          title: "Created successfully",
          description: "Reminder has been created",
        });
        setProgress(0);
        form.reset();
      }, 1000);
    },
  });

  const deleteReminder = api.reminder.deleteReminderById.useMutation({
    onMutate: () => {
      setProgress(33);
      progressTimeoutHandle.current = setTimeout(() => {
        setProgress(55);
      }, 200);
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: JSON.stringify(e.data?.zodError?.fieldErrors),
      });
      clearTimeout(progressTimeoutHandle.current);
      setProgress(0);
    },
    onSuccess: (_data, { id }) => {
      setProgress(88);
      setTimeout(() => {
        router.refresh();
        toast({
          title: "Deleted successfully",
          description: "Reminder has been deleted",
        });
        setProgress(0);
        closeEditDialog?.(id);
        form.reset();
      }, 1000);
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: reminderToEdit?.name ?? "",
      remindAt: reminderToEdit?.remindAt ?? new Date(),
      repeatPeriodicity:
        reminderToEdit?.repeatPeriodicity ?? Periodicity.yearly,
      customRepeatPeriodicity: reminderToEdit?.repeatIntervalSeconds ?? 5,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user?.id) {
      alert("Not logged in ...somehow");
      return;
    }
    if (!user.primaryEmailAddress) {
      alert("You need to have an email address set to create a reminder!");
      return;
    }
    const newValues = {
      name: data.name,
      remindAt: data.remindAt,
      repeatPeriodicity: data.repeatPeriodicity,
      repeatIntervalSeconds: data.customRepeatPeriodicity ?? 5,
      userId: user.id,
      email: user.primaryEmailAddress.emailAddress,
    };
    if (reminderToEdit) {
      updateReminder.mutate({ id: reminderToEdit.id, ...newValues });
    } else {
      createReminder.mutate(newValues);
    }
  }

  if (progress) {
    return <Progress value={progress} />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`${!reminderToEdit ? "w-2/3" : ""} space-y-6`}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My reminder" {...field} />
              </FormControl>
              <FormDescription>Name of the reminder</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remindAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Remind At</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Actual date of your event</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeatPeriodicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Periodicity</FormLabel>
              <Select
                onValueChange={(e) => {
                  setCustomPeriodicity(e == Periodicity.custom.toString());
                  field.onChange(e);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select how often to remind" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(Periodicity).map(([k, e]) => (
                    <SelectItem key={e} value={e}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select desired periodicity or select other and type number of
                days
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {customPeriodicity ? (
          <FormField
            control={form.control}
            name="customRepeatPeriodicity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom periodicity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  How many days between reminders
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
        <div className="flex justify-end gap-2">
          {reminderToEdit && (
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                deleteReminder.mutate({
                  id: reminderToEdit.id,
                  userId: user?.id ?? "",
                })
              }
            >
              Delete
            </Button>
          )}
          <Button type="submit">{reminderToEdit ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  );
}
