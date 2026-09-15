import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  // Mock data for demo
  const history = [
    {
      id: "1",
      date: "2026-09-15 14:30",
      purpose: "Safety",
      language: "English",
      detailLevel: "Detailed",
      candidate: "A person is walking dangerously close to a wet road holding a red umbrella, while a speeding car approaches from behind.",
      final: "A person is walking near a wet road holding a red umbrella, with a car visible.",
      score: 75,
      unsupported: 2,
    },
    {
      id: "2",
      date: "2026-09-15 14:15",
      purpose: "Accessibility",
      language: "English",
      detailLevel: "Short",
      candidate: "A person holding a red umbrella walking near a wet road with a car.",
      final: "A person holding a red umbrella walking near a wet road with a car.",
      score: 100,
      unsupported: 0,
    }
  ];

  return (
    <div className="container p-6 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Generation History</h1>
        <p className="text-muted-foreground">View and compare your past caption generations and verifications.</p>
      </div>

      <div className="grid gap-6">
        {history.map(item => (
          <Card key={item.id} className="overflow-hidden hover:border-primary/50 transition-colors">
            <div className="grid md:grid-cols-[200px_1fr] h-full">
              {/* Mock Image Thumbnail */}
              <div className="bg-muted flex items-center justify-center p-4 border-r">
                <div className="text-muted-foreground text-sm font-medium">Image {item.id}</div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded">{item.purpose}</span>
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded">{item.language}</span>
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded">{item.detailLevel}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{item.date}</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-muted-foreground mb-1">CANDIDATE CAPTION</div>
                    <div className={`text-sm ${item.unsupported > 0 ? "text-muted-foreground line-through" : ""}`}>
                      {item.candidate}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm bg-muted/50 p-3 rounded-lg border">
                    <div className="font-bold flex items-center gap-1">
                      {item.score >= 90 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      Verification Score: {item.score}%
                    </div>
                    <div className="text-muted-foreground border-l pl-4">
                      Unsupported Claims: <span className={item.unsupported > 0 ? "text-amber-600 font-bold" : ""}>{item.unsupported}</span>
                    </div>
                  </div>

                  {item.unsupported > 0 && (
                    <div>
                      <div className="text-xs font-bold text-primary mb-1">REFINED CAPTION</div>
                      <div className="text-sm font-medium">
                        {item.final}
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
