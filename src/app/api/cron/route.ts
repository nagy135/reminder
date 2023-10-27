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

  await transporter.sendMail({
    from: '"Your Name" <youremail@gmail.com>', // sender address
    to: "legolas1598753@centrum.sk", // list of receivers
    subject: "Medium @edigleyssonsilva ✔", // Subject line
    text: "There is a new article. It's about sending emails, check it out!", // plain text body
    html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
  });
  return NextResponse.json({ ok: true });
}
