import taskModel from "@/app/models/task-model";
import { MongoDBConnection } from "@/lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id: Id } = await req.json();
  try {
    await MongoDBConnection();
    const id = new mongoose.Types.ObjectId(Id);
    const existingTask = await taskModel.findById(id);
    if (!existingTask) {
      return NextResponse.json(
        { error: "please try again later " },
        { status: 404 }
      );
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
        { error: "please try again later " },
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
