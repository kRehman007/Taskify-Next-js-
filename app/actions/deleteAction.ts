"use server";
import taskModel from "../models/task-model";

export async function DeleteTask(id: number) {
  try {
    const deletedTask = await taskModel.findOneAndDelete({ _id: id });

    if (!deletedTask) {
      return { error: "Task not found", status: 404 }; // ✅ Return plain object
    }

    return { message: "Task deleted successfully", status: 200 }; // ✅ Return plain object
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error in deleting task:", error.message);
      return { error: "Internal server error", status: 500 };
    }
  }
}
