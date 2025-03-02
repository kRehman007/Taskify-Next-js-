import mongoose from "mongoose";

interface ITask {
  title: string;
  content: string;
  isCompleted: boolean;
  user: mongoose.Schema.Types.ObjectId;
}

const TaskSchema = new mongoose.Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    isCompleted: { type: Boolean, default: false, set: (v: any) => Boolean(v) },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const taskModel = mongoose.models.task || mongoose.model("task", TaskSchema);
export default taskModel;
