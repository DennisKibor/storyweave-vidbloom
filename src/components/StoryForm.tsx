import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

interface StoryFormProps {
  onGenerate: (data: StoryFormData) => void;
  isGenerating: boolean;
}

export interface StoryFormData {
  title: string;
  character: string;
  theme: string;
  setting: string;
  mood: string;
  authorName: string;
  pageCount: number;
  storyLength: string;
}

export const StoryForm = ({ onGenerate, isGenerating }: StoryFormProps) => {
  const [formData, setFormData] = useState<StoryFormData>({
    title: "",
    character: "",
    theme: "",
    setting: "",
    mood: "adventurous",
    authorName: "",
    pageCount: 5,
    storyLength: "medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-gradient-card shadow-story border-2 border-border/50 p-8 rounded-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Your Story</h2>
            <p className="text-muted-foreground">Tell us about your story and we'll bring it to life</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground font-medium">
                Story Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., The Adventures of Luna"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-background/50 border-border/50 focus:border-primary rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorName" className="text-foreground font-medium">
                Author Name
              </Label>
              <Input
                id="authorName"
                placeholder="e.g., Your name"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="bg-background/50 border-border/50 focus:border-primary rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="character" className="text-foreground font-medium">
                Main Character
              </Label>
              <Input
                id="character"
                placeholder="e.g., A brave young dragon"
                value={formData.character}
                onChange={(e) => setFormData({ ...formData, character: e.target.value })}
                required
                className="bg-background/50 border-border/50 focus:border-primary rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme" className="text-foreground font-medium">
                Story Theme
              </Label>
              <Input
                id="theme"
                placeholder="e.g., Finding courage, Making friends"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                required
                className="bg-background/50 border-border/50 focus:border-primary rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="setting" className="text-foreground font-medium">
                Setting
              </Label>
              <Textarea
                id="setting"
                placeholder="e.g., A magical forest with glowing trees"
                value={formData.setting}
                onChange={(e) => setFormData({ ...formData, setting: e.target.value })}
                required
                className="bg-background/50 border-border/50 focus:border-primary rounded-xl min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood" className="text-foreground font-medium">
                Story Mood
              </Label>
              <select
                id="mood"
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-colors text-foreground"
              >
                <option value="adventurous">Adventurous</option>
                <option value="whimsical">Whimsical</option>
                <option value="heartwarming">Heartwarming</option>
                <option value="mysterious">Mysterious</option>
                <option value="funny">Funny</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pageCount" className="text-foreground font-medium">
                  Number of Pages
                </Label>
                <select
                  id="pageCount"
                  value={formData.pageCount}
                  onChange={(e) => setFormData({ ...formData, pageCount: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-colors text-foreground"
                >
                  <option value={3}>3 pages</option>
                  <option value={5}>5 pages</option>
                  <option value={7}>7 pages</option>
                  <option value={10}>10 pages</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storyLength" className="text-foreground font-medium">
                  Text per Page
                </Label>
                <select
                  id="storyLength"
                  value={formData.storyLength}
                  onChange={(e) => setFormData({ ...formData, storyLength: e.target.value })}
                  className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-colors text-foreground"
                >
                  <option value="short">Short (1-2 sentences)</option>
                  <option value="medium">Medium (2-3 sentences)</option>
                  <option value="long">Long (3-4 sentences)</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 py-6 rounded-xl text-lg font-semibold shadow-soft transition-all hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Story...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Story
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};
