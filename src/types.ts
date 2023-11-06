import { type Periodicity } from "~/enums";

export type Reminder = {
  id: number;
  userId: string;
  name: string;
  remindAt: Date;
  repeatPeriodicity: Periodicity;
  repeatIntervalSeconds: number;
};
