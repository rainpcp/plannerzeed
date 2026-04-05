import { NextRequest, NextResponse } from "next/server";
import { handleGetTasks, handleCreateTask } from "@/lib/api-handlers";

function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tasks = await handleGetTasks(userId);
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const task = await handleCreateTask(body, userId);
  return NextResponse.json(task);
}
