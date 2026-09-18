import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { globalRateLimiter } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    if (!globalRateLimiter.check(userId)) {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const {
      inlineData,
      purpose,
      language,
      detailLevel,
      candidateCaption,
      finalCaption,
      evidence,
      verification,
      processingTimeMs
    } = body;

    if (!inlineData || !candidateCaption) {
      return NextResponse.json({ message: "Missing essential data to save" }, { status: 400 });
    }

    // 1. Save Image to local disk
    const buffer = Buffer.from(inlineData.data, "base64");
    
    // Create random filename
    const ext = inlineData.mimeType.split('/')[1] || "jpeg";
    const filename = `${crypto.randomBytes(16).toString("hex")}.${ext}`;
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;
    const size = buffer.length;

    // 2. Persist to DB using transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Image
      const image = await tx.image.create({
        data: {
          userId,
          url: imageUrl,
          filename,
          size,
          mimeType: inlineData.mimeType,
        }
      });

      // Create Generation
      const generation = await tx.captionGeneration.create({
        data: {
          imageId: image.id,
          userId,
          purpose,
          language,
          detailLevel,
          candidateCaption,
          finalCaption,
          verificationEnabled: !!verification,
          provider: "gemini",
          model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
          processingTimeMs: processingTimeMs || 0,
        }
      });

      // Create Evidence if exists
      if (evidence) {
        await tx.visualEvidence.create({
          data: {
            generationId: generation.id,
            data: JSON.stringify(evidence),
          }
        });
      }

      // Create Verification if exists
      if (verification) {
        const vr = await tx.verificationResult.create({
          data: {
            generationId: generation.id,
            overallScore: verification.overallScore || 0,
            unsupportedClaims: verification.unsupportedClaims || 0,
            uncertainClaims: verification.uncertainClaims || 0,
          }
        });

        // Create Claims
        if (verification.claims && Array.isArray(verification.claims)) {
          const claimData = verification.claims.map((c: any) => ({
            verificationResultId: vr.id,
            type: c.type || "OTHER",
            text: c.text,
            isSupported: c.status === "supported",
            confidence: c.confidence || 0,
            reasoning: c.reasoning || ""
          }));
          
          await tx.verificationClaim.createMany({
            data: claimData
          });
        }
      }

      return generation;
    });

    return NextResponse.json({ success: true, generationId: result.id });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ message: "Internal server error during save" }, { status: 500 });
  }
}
