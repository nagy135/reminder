import ReminderEmail from "@email/reminder";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { env } from "process";

const forceRevalidate = (request: NextRequest) => {
  const path = request.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
};

export async function GET(request: NextRequest) {
  forceRevalidate(request);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_PASSWORD,
    },
  });

  const timeStamp = new Date().toISOString();

  const response = await transporter.sendMail({
    from: '"Your reminder god" <reminder-god@gmail.com>', // sender address
    to: "legolas1598753@centrum.sk", // list of receivers
    subject: `new reminder!`, // Subject line
    html: render(ReminderEmail({})),
  });

  return NextResponse.json({
    messageId: response.messageId,
    now: Date.now(),
  });
}

export const fetchCache = "force-no-store";
