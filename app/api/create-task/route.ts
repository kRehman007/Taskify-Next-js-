import taskModel from "@/app/models/task-model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, content } = await req.json();
  if (!title || !content) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 401 }
    );
  }

  try {
    const userId = req.headers.get("user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "unAuthorized, Login first" },
        { status: 404 }
      );
    }
    const createdTask = await taskModel.create({
      title,
      content,
      user: userId,
      isCompleted: Boolean(false),
    });
    return NextResponse.json({ createdTask }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("error in creating-task action", error.message);
      return NextResponse.json(
        { error: "Oops! Something went wrong." },
        { status: 500 }
      );
    }
  }
}
