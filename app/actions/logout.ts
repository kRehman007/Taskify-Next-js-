"use server";

import { cookies } from "next/headers";

export async function LogoutUser() {
  try {
    const cookieStore = await cookies(); // Await cookies() to resolve
    cookieStore.delete("token");
  } catch (error) {
    console.log("error in loguting", error);
    throw new Error("logout failed, please try again later");
  }
}
