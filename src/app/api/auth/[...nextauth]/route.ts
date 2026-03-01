// Optional: NextAuth handler — uncomment when NextAuth is configured
// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth-options";

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

export async function GET() {
  return new Response("Auth not configured", { status: 501 });
}

export async function POST() {
  return new Response("Auth not configured", { status: 501 });
}
