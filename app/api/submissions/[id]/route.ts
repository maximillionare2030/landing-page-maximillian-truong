import { NextRequest, NextResponse } from "next/server";
import { getSubmissionWithAssets } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await getSubmissionWithAssets(params.id);

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission", details: String(error) },
      { status: 500 }
    );
  }
}

