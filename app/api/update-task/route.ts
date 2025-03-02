import taskModel from "@/app/models/task-model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();
  try {
    const existingTask = await taskModel.findById(id);
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: id },
      { isCompleted: !existingTask.isCompleted },
      {
        new: true,
      }
    );
    if (!updatedTask) {
      console.log("Failed to update task for ID:", id);
      return NextResponse.json(
        { error: "Task update failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Task updated successfully", updatedTask }, // ✅ Return updated task
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error in updating task:", error.message);
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  }
}
