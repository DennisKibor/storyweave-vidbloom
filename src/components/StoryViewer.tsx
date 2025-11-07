import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

export interface StoryPage {
  text: string;
  image: string;
}

interface StoryViewerProps {
  pages: StoryPage[];
  title: string;
}

export const StoryViewer = ({ pages, title }: StoryViewerProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const downloadStory = async () => {
    setIsDownloading(true);
    toast({
      title: "Preparing download",
      description: "Creating your storybook PDF...",
    });

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

      // Add title page
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      const titleLines = pdf.splitTextToSize(title, contentWidth);
      pdf.text(titleLines, pageWidth / 2, pageHeight / 2, { align: "center" });

      // Add each story page
      for (let i = 0; i < pages.length; i++) {
        pdf.addPage();

        // Convert base64 image to proper format
        const imgData = pages[i].image;
        
        // Add image
        const imgWidth = contentWidth;
        const imgHeight = (imgWidth * 3) / 4; // 4:3 aspect ratio
        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);

        // Add text below image
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        const textY = margin + imgHeight + 10;
        const textLines = pdf.splitTextToSize(pages[i].text, contentWidth);
        pdf.text(textLines, pageWidth / 2, textY, { align: "center" });

        // Add page number
        pdf.setFontSize(10);
        pdf.text(
          `Page ${i + 1} of ${pages.length}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Download complete!",
        description: "Your storybook has been saved.",
      });
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to create PDF. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground">
            Page {currentPage + 1} of {pages.length}
          </p>
        </div>

        <Card className="bg-card shadow-story rounded-3xl overflow-hidden border-2 border-border/50">
          <div className="aspect-[16/10] bg-gradient-card relative">
            <img
              src={pages[currentPage].image}
              alt={`Story page ${currentPage + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
          </div>

          <div className="p-8 bg-gradient-card">
            <p className="text-lg md:text-xl leading-relaxed text-card-foreground text-center max-w-3xl mx-auto">
              {pages[currentPage].text}
            </p>
          </div>

          <div className="flex items-center justify-between p-6 bg-muted/30 border-t border-border/50">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              variant="outline"
              className="rounded-xl"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentPage
                      ? "bg-primary w-8"
                      : "bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={nextPage}
              disabled={currentPage === pages.length - 1}
              variant="outline"
              className="rounded-xl"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        <div className="flex gap-4 justify-center mt-8">
          <Button 
            variant="outline" 
            className="rounded-xl"
            onClick={downloadStory}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Creating PDF..." : "Download Story"}
          </Button>
          <Button variant="outline" className="rounded-xl">
            <Share2 className="mr-2 h-4 w-4" />
            Share Story
          </Button>
        </div>
      </div>
    </section>
  );
};
