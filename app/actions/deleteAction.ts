"use server";
import mongoose from "mongoose";
import taskModel from "../models/task-model";
import { MongoDBConnection } from "@/lib/db";

export async function DeleteTask(id: number) {
  try {
    await MongoDBConnection();
    const Id = new mongoose.Types.ObjectId(id);
    const deletedTask = await taskModel.findOneAndDelete({ _id: Id });
    if (!deletedTask) {
      return { error: "Please try again later", status: 401 }; // Return as an object
    }

    return { message: "Task deleted successfully", status: 200 };
  } catch (error: unknown) {
    console.log("Error in deleting task:", (error as Error).message);
    return { error: "Please try again later", status: 500 };
  }
}
