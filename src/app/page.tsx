import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex font-bold text-xl tracking-tight items-center gap-2">
          <div className="bg-primary text-primary-foreground w-8 h-8 rounded-md flex items-center justify-center font-black">
            V
          </div>
          VISIONCAPTION<span className="text-primary">+</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/login?register=true">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 flex items-center justify-center text-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8">
              <div className="space-y-4 max-w-[800px]">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Generate the right caption.
                  <br className="hidden sm:inline" />
                  <span className="text-primary/80"> Verify what the image actually supports.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  VisionCaption+ is an adaptive image-captioning platform that generates purpose-specific descriptions and verifies them against visual evidence.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg" className="h-12 px-8 text-base">Try VisionCaption+</Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">Explore the Technology</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-20 bg-muted/50 border-y">
          <div className="container px-4 md:px-6 text-center max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-12">Evidence-Grounded Caption Verification</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-4 bg-background p-6 rounded-xl border shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">1</div>
                <h3 className="text-xl font-bold">Purpose-Aware</h3>
                <p className="text-muted-foreground">Select from 6 core modes including Accessibility, Social Media, Education, and Safety to adapt the description.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 bg-background p-6 rounded-xl border shadow-sm relative md:-top-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">2</div>
                <h3 className="text-xl font-bold">Candidate Generation</h3>
                <p className="text-muted-foreground">The system generates a candidate caption in your requested language and detail level.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 bg-background p-6 rounded-xl border shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">3</div>
                <h3 className="text-xl font-bold">Evidence Verification</h3>
                <p className="text-muted-foreground">Claims are cross-checked against visual evidence. Unsupported claims trigger automatic refinement.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t py-6 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">
          © 2026 VisionCaption+ Research. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
