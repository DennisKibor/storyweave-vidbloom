import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { StoryForm, StoryFormData } from "@/components/StoryForm";
import { StoryViewer, StoryPage } from "@/components/StoryViewer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyPages, setStoryPages] = useState<StoryPage[] | null>(null);
  const [storyTitle, setStoryTitle] = useState("");
  const storyFormRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToForm = () => {
    storyFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGenerateStory = async (formData: StoryFormData) => {
    setIsGenerating(true);
    setStoryPages(null);

    try {
      // Generate story using AI
      const { data: storyData, error: storyError } = await supabase.functions.invoke(
        "generate-story",
        {
          body: formData,
        }
      );

      if (storyError) throw storyError;

      const { title, pages } = storyData;
      setStoryTitle(title);

      // Generate images for each page
      const pagesWithImages: StoryPage[] = [];
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        toast({
          title: `Generating illustration ${i + 1} of ${pages.length}`,
          description: "Creating beautiful artwork for your story...",
        });

        const { data: imageData, error: imageError } = await supabase.functions.invoke(
          "generate-image",
          {
            body: {
              prompt: `Beautiful storybook illustration: ${page.imagePrompt}. Style: children's book illustration, vibrant colors, whimsical, detailed, high quality.`,
            },
          }
        );

        if (imageError) throw imageError;

        pagesWithImages.push({
          text: page.text,
          image: imageData.image,
        });
      }

      setStoryPages(pagesWithImages);

      toast({
        title: "Story created!",
        description: "Your magical storybook is ready.",
      });

      // Scroll to story viewer
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate your story. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={scrollToForm} />
      
      <div ref={storyFormRef}>
        <StoryForm onGenerate={handleGenerateStory} isGenerating={isGenerating} />
      </div>

      {storyPages && <StoryViewer pages={storyPages} title={storyTitle} />}
    </div>
  );
};

export default Index;
