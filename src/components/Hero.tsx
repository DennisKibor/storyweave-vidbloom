import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Video } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">AI-Powered Storytelling</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            Create Magical
            <br />
            <span className="bg-gradient-to-r from-secondary to-primary-foreground bg-clip-text text-transparent">
              Storybooks with Video
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into beautifully illustrated storybooks paired with captivating short videos—all powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-glow text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Create Your Story
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-xl"
            >
              <Video className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              { icon: BookOpen, title: "AI Stories", desc: "Realistic narratives crafted by advanced AI" },
              { icon: Sparkles, title: "Custom Illustrations", desc: "Unique artwork for every story page" },
              { icon: Video, title: "Video Integration", desc: "Short videos that bring stories to life" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-6 hover:bg-primary-foreground/15 transition-all hover:scale-105"
              >
                <feature.icon className="w-8 h-8 text-primary-foreground mb-3 mx-auto" />
                <h3 className="font-semibold text-primary-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-primary-foreground/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
