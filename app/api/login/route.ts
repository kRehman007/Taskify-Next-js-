import { MongoDBConnection } from "@/lib/db";
import userModel from "@/app/models/user-model";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { generateTokenForUser } from "@/lib/generateAndValidateTokenForUser";
import { User } from "@/lib/interface";

export async function POST(req: Request) {
  await MongoDBConnection();
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  try {
    const Existeduser = await userModel.findOne({ email }).select("+password");
    if (!Existeduser) {
      return NextResponse.json(
        { error: "email or password is incorrect" },
        { status: 400 }
      );
    }

    const isMatch = await bcryptjs.compare(password, Existeduser.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "email or password is incorrect" },
        { status: 400 }
      );
    }
    const user: User = {
      id: Existeduser.id,
      fullname: Existeduser.fullname,
      username: Existeduser.username,
      email: Existeduser.email,
    };
    const token = generateTokenForUser(user);
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
      maxAge: 7 * 24 * 24 * 60, // 7 Days...
    });
    return response;
  } catch (error: any) {
    console.log("error in logging-user route", error.message);
    return NextResponse.json(
      { error: `Internal server error ${error.message}` },
      { status: 500 }
    );
  }
}
