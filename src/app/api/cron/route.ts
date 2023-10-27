import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
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
    from: '"Your Name" <youremail@gmail.com>', // sender address
    to: "legolas1598753@centrum.sk", // list of receivers
    subject: `email ${timeStamp}`, // Subject line
    text: "Hello world", // plain text body
    html: "<b>Hello world</b>", // html body
  });

  return NextResponse.json({ 
    messageId: response.messageId,
    revalidated: true,
    now: Date.now()
  });
}

export const fetchCache = 'force-no-store';
