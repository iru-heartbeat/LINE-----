import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendBroadcast, getFollowerCount } from "@/lib/line";
import { createBroadcast } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { message } = (await request.json()) as { message?: string };
  if (!message || !message.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  await sendBroadcast(message);
  const recipientCount = (await getFollowerCount()) ?? 0;
  await createBroadcast({ message, recipientCount });

  return NextResponse.json({ status: "ok", recipientCount });
}
