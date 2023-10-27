import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { env } from "process";

export async function GET() {
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
    from: '"Your Name" <youremail@gmail.com>', // sender address
    to: "legolas1598753@centrum.sk", // list of receivers
    subject: `email ${timeStamp}`, // Subject line
    text: "Hello world", // plain text body
    html: "<b>Hello world</b>", // html body
  });

  return NextResponse.json({ ok: true, messageId: response.messageId, timeStamp });
}

export const fetchCache = 'force-no-store';
