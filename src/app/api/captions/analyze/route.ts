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

    const { imageUrl, inlineData } = await req.json();
    
    if (!inlineData && !imageUrl) {
      return NextResponse.json({ message: "Missing image data" }, { status: 400 });
    }

    const provider = getVisionCaptionProvider();
    
    const evidence = await provider.analyzeImage({ imageUrl: imageUrl || "", inlineData });
    
    return NextResponse.json(evidence);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
