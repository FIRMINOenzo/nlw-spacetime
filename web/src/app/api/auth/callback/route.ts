import { api } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");

  const registerResponde = await api.post("/register", {
    code,
  });

  const { token } = registerResponde.data;

  const redirectURL = new URL("/", request.url);

  const cookieExpireInSec = 60 * 60 * 24 * 15;

  return NextResponse.redirect(redirectURL, {
    headers: {
      "Set-Cookie": `token=${token}; Path=/; max-age=${cookieExpireInSec}`,
    },
  });
}
