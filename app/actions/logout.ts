"use server";

import { cookies } from "next/headers";

export async function LogoutUser() {
  try {
    const cookieStore = await cookies(); // Await cookies() to resolve
    cookieStore.delete("token");
    return { message: "successfully logged-out", status: 200 };
  } catch (error: unknown) {
    console.log("error in loguting", (error as Error).message);
    return { error: "logout failed, please try again later", status: 500 };
  }
}
