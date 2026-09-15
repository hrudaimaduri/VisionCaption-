import { NextResponse } from "next/server";
import { getVisionCaptionProvider } from "@/lib/ai/provider";

export async function POST(req: Request) {
  try {
    const { caption, verification, evidence, language } = await req.json();
    const provider = getVisionCaptionProvider();
    
    const refinedCaption = await provider.refineCaption({ 
      caption, 
      verification, 
      evidence,
      language
    });
    
    return NextResponse.json({ refinedCaption });
  } catch (error) {
    console.error("Refine error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
