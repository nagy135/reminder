"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/app/_components/ui/button";
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
import { useState } from "react";

enum Periodicity {
  daily = "DAILY",
  weekly = "WEEKLY",
  monthly = "MONTHLY",
  yearly = "YEARLY",
  oneTime = "ONETIME",
  custom = "CUSTOM",
}

const FormSchema = z.object({
  name: z
    .string({
      required_error: "Please select a name",
    })
    .describe("Name"),
  remindAt: z.date({
    required_error: "Please select date of event",
  }),
  repeatPeriodicity: z.nativeEnum(Periodicity, {
    required_error: "Please select periodicity",
  }),
  customRepeatPeriodicity: z.coerce.number().optional(),
});

export function CreateReminder() {
  const [customPeriodicity, setCustomPeriodicity] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "My reminder",
      remindAt: new Date(),
      repeatPeriodicity: Periodicity.daily,
      customRepeatPeriodicity: 5,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("================\n", "data: ", data, "\n================");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
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
                  setCustomPeriodicity(e === Periodicity.custom);
                  field.onChange(e);
                }}
                defaultValue={field.value}
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
