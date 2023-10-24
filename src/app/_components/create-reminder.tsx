"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";
import { DatePicker } from "./date-picker";

export function CreateReminder() {
  const router = useRouter();
  const { user } = useUser();
  const [name, setName] = useState("test");
  const [date, setDate] = useState(new Date());
  const [repeatPeriodicity, setRepeatPeriodicity] = useState(0);

  const createReminder = api.post.createReminder.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  if (!user) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createReminder.mutate({
          name,
          remindAt: date,
          repeatPeriodicity,
          email: "viktor.nagy1995@gmail.com",
          userId: user.id,
        });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <DatePicker />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createReminder.isLoading}
      >
        {createReminder.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
