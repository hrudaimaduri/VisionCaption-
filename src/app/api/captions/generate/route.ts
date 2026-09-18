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

    const body = await req.json();
    const provider = getVisionCaptionProvider();

    if (!body.purpose || !body.language || !body.detailLevel || !body.evidence) {
      return NextResponse.json({ message: "Missing required generation parameters" }, { status: 400 });
    }

    // Pass mock empty url since we're chaining logic in the demo
    const caption = await provider.generateCaption(
      {
        imageUrl: "",
        purpose: body.purpose,
        language: body.language,
        detailLevel: body.detailLevel,
        inlineData: body.inlineData
      },
      body.evidence
    );

    return NextResponse.json({ caption });
  } catch (error: any) {
    console.error("Generate error:", error?.message || error);

    const errorMessage = error?.message?.toLowerCase() || "";
    const status = error?.status || error?.response?.status;

    if (status === 503 || errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("temporarily overloaded")) {
      return NextResponse.json({ message: "Gemini is temporarily unavailable. Please try again in a moment." }, { status: 503 });
    }
    if (status === 429 || errorMessage.includes("429") || errorMessage.includes("quota")) {
      return NextResponse.json({ message: "Rate limit exceeded. Please try again later." }, { status: 429 });
    }

    return NextResponse.json({ message: "An unexpected error occurred during generation." }, { status: 500 });
  }
}
