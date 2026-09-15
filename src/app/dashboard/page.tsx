"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GenerationInput, VerificationResult, VisualEvidence } from "@/types/ai";
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertTriangle, RefreshCw, XCircle } from "lucide-react";

export default function WorkspacePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("General");
  const [language, setLanguage] = useState("English");
  const [detailLevel, setDetailLevel] = useState("Medium");
  
  const [status, setStatus] = useState<"idle" | "analyzing" | "generating" | "verifying" | "refining" | "complete">("idle");
  const [candidateCaption, setCandidateCaption] = useState<string>("");
  const [finalCaption, setFinalCaption] = useState<string>("");
  const [evidence, setEvidence] = useState<VisualEvidence | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      resetState();
    }
  };

  const resetState = () => {
    setStatus("idle");
    setCandidateCaption("");
    setFinalCaption("");
    setEvidence(null);
    setVerification(null);
  }

  const handleGenerate = async () => {
    if (!imagePreview) return;
    
    // Reset state
    resetState();
    
    // 1. Analyze
    setStatus("analyzing");
    
    try {
      // In a real app we'd upload the image to storage first, then call our API.
      // Here we simulate the API call sequence for the demo.
      const analyzeRes = await fetch("/api/captions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: "mock-url" })
      });
      const evidenceData = await analyzeRes.json();
      setEvidence(evidenceData);
      
      // 2. Generate
      setStatus("generating");
      const genRes = await fetch("/api/captions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          purpose, 
          language, 
          detailLevel,
          evidence: evidenceData
        })
      });
      const { caption } = await genRes.json();
      setCandidateCaption(caption);
      
      // 3. Verify
      setStatus("verifying");
      const verifyRes = await fetch("/api/captions/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          caption,
          evidence: evidenceData
        })
      });
      const verificationData = await verifyRes.json();
      setVerification(verificationData);
      
      // 4. Refine (if needed)
      if (verificationData.unsupportedClaims > 0) {
        setStatus("refining");
        const refineRes = await fetch("/api/captions/refine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            caption,
            verification: verificationData,
            evidence: evidenceData,
            language
          })
        });
        const { refinedCaption } = await refineRes.json();
        setFinalCaption(refinedCaption);
      } else {
        setFinalCaption(caption);
      }
      
      setStatus("complete");
      
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("An error occurred during processing.");
    }
  };

  return (
    <div className="container p-6 mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT PANEL - Image & Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Source</CardTitle>
              <CardDescription>Upload an image to analyze and caption.</CardDescription>
            </CardHeader>
            <CardContent>
              {!imagePreview ? (
                <div 
                  className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-1">Click to upload</h3>
                  <p className="text-sm text-muted-foreground">JPG, PNG, WEBP up to 5MB</p>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="w-full h-auto object-contain max-h-[400px]" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                      Replace Image
                    </Button>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp" 
                onChange={handleImageUpload}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                  >
                    <option>Accessibility</option>
                    <option>Social Media</option>
                    <option>Education</option>
                    <option>E-commerce</option>
                    <option>General</option>
                    <option>Safety</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Telugu</option>
                    <option>Tamil</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Detail Level</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={detailLevel}
                    onChange={e => setDetailLevel(e.target.value)}
                  >
                    <option>Short</option>
                    <option>Medium</option>
                    <option>Detailed</option>
                  </select>
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="flex items-center space-x-2 h-10">
                    <input type="checkbox" checked readOnly className="rounded border-gray-300" />
                    <span>Enable Verification</span>
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                disabled={!imagePreview || status !== "idle"}
                onClick={handleGenerate}
              >
                {status === "idle" ? "Generate & Verify" : "Processing..."}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* RIGHT PANEL - Results & Workspace */}
        <div className="space-y-6">
          {status === "idle" && !candidateCaption && (
            <Card className="h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-dashed">
              <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">Result Workspace</h3>
              <p>Upload an image and click Generate to see the pipeline in action.</p>
            </Card>
          )}

          {status !== "idle" && (
            <Card className="border-primary/50 shadow-md">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <CardTitle className="text-lg flex justify-between items-center">
                  Pipeline Status
                  <span className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                    {status !== "complete" && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
                    {status === "complete" ? "Finished" : "Working..."}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                {/* STATUS INDICATORS */}
                <div className="space-y-2 text-sm font-medium">
                  <div className={`flex justify-between items-center p-2 rounded ${status === "analyzing" ? "bg-primary/10 text-primary" : evidence ? "text-muted-foreground" : "opacity-40"}`}>
                    <span>1. Visual Understanding</span>
                    {evidence && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${status === "generating" ? "bg-primary/10 text-primary" : candidateCaption ? "text-muted-foreground" : "opacity-40"}`}>
                    <span>2. Candidate Generation</span>
                    {candidateCaption && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${status === "verifying" ? "bg-primary/10 text-primary" : verification ? "text-muted-foreground" : "opacity-40"}`}>
                    <span>3. Evidence Verification</span>
                    {verification && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${status === "refining" ? "bg-primary/10 text-primary" : finalCaption && candidateCaption !== finalCaption ? "text-primary" : finalCaption ? "text-muted-foreground" : "opacity-40"}`}>
                    <span>4. Caption Refinement</span>
                    {finalCaption && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </div>
                </div>

                {/* RESULTS */}
                {candidateCaption && (
                  <div className="pt-4 border-t space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground mb-2">CANDIDATE CAPTION</h4>
                      <p className={`p-3 rounded-md border bg-muted/20 ${verification?.unsupportedClaims ? "border-amber-500/50 line-through text-muted-foreground" : ""}`}>
                        {candidateCaption}
                      </p>
                    </div>

                    {verification && (
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-bold">VERIFICATION RESULT</h4>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${verification.overallScore > 80 ? "bg-green-500/20 text-green-600" : "bg-amber-500/20 text-amber-600"}`}>
                            Score: {verification.overallScore}%
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {verification.claims.map((claim, idx) => (
                            <div key={idx} className="flex gap-2 items-start text-sm">
                              {claim.isSupported ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              )}
                              <div>
                                <span className="font-medium">[{claim.type}] {claim.text}</span>
                                {!claim.isSupported && (
                                  <p className="text-xs text-amber-600/80 mt-1">{claim.reasoning}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {finalCaption && (
                      <div>
                        <h4 className="text-sm font-bold text-primary mb-2">VERIFIED FINAL CAPTION</h4>
                        <div className="p-4 rounded-md border-2 border-primary/20 bg-primary/5 text-lg font-medium">
                          {finalCaption}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
