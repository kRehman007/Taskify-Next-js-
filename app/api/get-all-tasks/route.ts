import taskModel from "@/app/models/task-model";
import { MongoDBConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await MongoDBConnection();
    const userId = req.headers.get("user-id");
    const allTasks = await taskModel
      .find({ user: userId })
      .sort({ createdAt: -1 }); // ✅ Sort by newest first

    return NextResponse.json({ allTasks }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("error in getting-all-tasks", error.message);
      return NextResponse.json({ error: "unAuthorized" }, { status: 401 });
    }
  }
}
