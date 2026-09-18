import { NextResponse } from "next/server";
import { getVisionCaptionProvider } from "@/lib/ai/provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { globalRateLimiter } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!globalRateLimiter.check((session.user as any).id)) {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    const { caption, verification, evidence, language } = await req.json();
    
    if (!caption || !verification || !evidence || !language) {
      return NextResponse.json({ message: "Missing required refinement parameters" }, { status: 400 });
    }

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
