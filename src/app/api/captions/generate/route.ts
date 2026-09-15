import { NextResponse } from "next/server";
import { getVisionCaptionProvider } from "@/lib/ai/provider";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const provider = getVisionCaptionProvider();
    
    // Pass mock empty url since we're chaining logic in the demo
    const caption = await provider.generateCaption(
      { imageUrl: "", purpose: body.purpose, language: body.language, detailLevel: body.detailLevel }, 
      body.evidence
    );
    
    return NextResponse.json({ caption });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
