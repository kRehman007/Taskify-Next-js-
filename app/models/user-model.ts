import mongoose from "mongoose";

interface IUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    fullname: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.user || mongoose.model("user", UserSchema);
export default userModel;
