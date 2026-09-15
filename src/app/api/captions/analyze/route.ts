import { NextResponse } from "next/server";
import { getVisionCaptionProvider } from "@/lib/ai/provider";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    const provider = getVisionCaptionProvider();
    
    const evidence = await provider.analyzeImage({ imageUrl });
    
    return NextResponse.json(evidence);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
