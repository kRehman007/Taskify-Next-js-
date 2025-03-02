import { MongoDBConnection } from "@/lib/db";
import userModel from "@/app/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { generateTokenForUser } from "@/lib/generateAndValidateTokenForUser";
import { User } from "@/lib/interface";

export async function POST(req: Request) {
  await MongoDBConnection();
  const { fullname, username, email, password } = await req.json();
  if (!fullname || !username || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  try {
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    const existingUserName = await userModel.findOne({ username });
    if (existingUserName) {
      return NextResponse.json(
        { success: false, error: "username already taken" },
        { status: 409 }
      );
    }
    const hashedPassword = await bcryptjs.hash(password, 12);
    const createdUser = await userModel.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });
    const user: User = {
      id: createdUser.id,
      fullname: createdUser.fullname,
      username: createdUser.username,
      email: createdUser.email,
    };
    const token = generateTokenForUser(createdUser);
    const response = NextResponse.json(
      {
        user: {
          ...user,
          token,
        },
      },
      { status: 201 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 24 * 60, // 7 Days....
    });
    return response;
  } catch (error: any) {
    console.log("error in creating-user route", error.message);
    return NextResponse.json(
      { error: `Internal server error ${error.message}` },
      { status: 500 }
    );
  }
}
