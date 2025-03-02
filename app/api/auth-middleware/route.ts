import { validateTokenForUser } from "@/lib/generateAndValidateTokenForUser";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token =
      (await cookies())?.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "unAuthorized" }, { status: 401 });
    }
    const user = validateTokenForUser(token);
    if (!user) {
      return NextResponse.json({ error: "unAuthorized" }, { status: 401 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("error in authenticating-user", error.message);
      return NextResponse.json({ error: "unAuthorized" }, { status: 401 });
    }
  }
}
