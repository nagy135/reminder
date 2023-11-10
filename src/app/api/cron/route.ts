import ReminderEmail from "@email/reminder";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { env } from "process";
import { api } from "~/trpc/server";
import { cutStringUntilChar } from "~/helpers";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const forceRevalidate = (request: NextRequest) => {
  const path = request.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_PASSWORD,
  },
});

export async function GET(request: NextRequest) {
  forceRevalidate(request);

  const reminders = await api.reminder.getRemindersByRemindAt.query(new Date());

  const sendEmailPromises: Promise<SMTPTransport.SentMessageInfo>[] = [];
  const deletePromises: Promise<void>[] = [];

  for (const reminder of reminders) {
    const sendEmailPromise = transporter.sendMail({
      from: '"Your reminder god" <reminder-god@gmail.com>',
      to: reminder.email,
      subject: `new reminder!`,
      html: render(
        ReminderEmail({
          username: cutStringUntilChar(reminder.email, "@"),
          name: reminder.name,
          remindAt: reminder.remindAt.toDateString(),
        }),
      ),
    });
    sendEmailPromises.push(sendEmailPromise);

    const deletePromise = api.reminder.deleteReminderById.mutate({
      id: reminder.id,
      userId: reminder.userId,
    });
    deletePromises.push(deletePromise);
  }

  await Promise.all(sendEmailPromises);
  await Promise.all(deletePromises);

  return NextResponse.json({
    success: true,
    now: Date.now(),
  });
}

export const fetchCache = "force-no-store";
