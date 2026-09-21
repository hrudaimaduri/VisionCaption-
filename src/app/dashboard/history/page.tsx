/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, ChevronRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const history = await prisma.captionGeneration.findMany({
    where: { userId },
    include: {
      image: true,
      verificationResult: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container p-6 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Generation History</h1>
        <p className="text-muted-foreground">View and compare your past caption generations and verifications.</p>
      </div>

      <div className="grid gap-6">
        {history.length === 0 && (
          <div className="text-center p-12 text-muted-foreground">
            No generations found.
          </div>
        )}
        
        {history.map(item => (
          <Card key={item.id} className="overflow-hidden hover:border-primary/50 transition-colors">
            <div className="grid md:grid-cols-[200px_1fr] h-full">
              {/* Image Thumbnail */}
              <div className="bg-muted flex items-center justify-center p-4 border-r relative min-h-[200px]">
                {item.image?.url ? (
                  <img 
                    src={item.image.url} 
                    alt="Uploaded image" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                ) : (
                  <ImageIcon className="text-muted-foreground/50 h-12 w-12" />
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded">{item.purpose}</span>
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded">{item.language}</span>
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded">{item.detailLevel}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-muted-foreground mb-1">CANDIDATE CAPTION</div>
                    <div className={`text-sm ${(item.verificationResult?.unsupportedClaims || 0) > 0 ? "text-muted-foreground line-through" : ""}`}>
                      {item.candidateCaption}
                    </div>
                  </div>

                  {item.verificationResult && (
                    <div className="flex items-center gap-4 text-sm bg-muted/50 p-3 rounded-lg border">
                      <div className="font-bold flex items-center gap-1">
                        {item.verificationResult.overallScore >= 90 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        Verification Score: {Math.round(item.verificationResult.overallScore)}%
                      </div>
                      <div className="text-muted-foreground border-l pl-4">
                        Unsupported Claims: <span className={item.verificationResult.unsupportedClaims > 0 ? "text-amber-600 font-bold" : ""}>{item.verificationResult.unsupportedClaims}</span>
                      </div>
                    </div>
                  )}

                  {item.finalCaption && item.finalCaption !== item.candidateCaption && (
                    <div>
                      <div className="text-xs font-bold text-primary mb-1">REFINED CAPTION</div>
                      <div className="text-sm font-medium">
                        {item.finalCaption}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
