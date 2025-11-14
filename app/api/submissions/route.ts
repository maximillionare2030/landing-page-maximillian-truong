import { NextRequest, NextResponse } from "next/server";
import { listSubmissions } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status") || undefined;

    const submissions = await listSubmissions(limit, status);

    return NextResponse.json({
      success: true,
      submissions,
      count: submissions.length,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions", details: String(error) },
      { status: 500 }
    );
  }
}

