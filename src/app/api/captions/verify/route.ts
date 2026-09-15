import { NextResponse } from "next/server";
import { getVisionCaptionProvider } from "@/lib/ai/provider";

export async function POST(req: Request) {
  try {
    const { caption, evidence } = await req.json();
    const provider = getVisionCaptionProvider();
    
    const verification = await provider.verifyCaption({ caption, evidence });
    
    return NextResponse.json(verification);
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
