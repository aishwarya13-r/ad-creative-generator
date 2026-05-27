import { useState } from "react";
import { Upload, Sparkles, Download, Wand2, Palette, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ProductUpload } from "@/components/product-upload";
import { AudienceForm } from "@/components/audience-form";
import { AdTextEditor } from "@/components/ad-text-editor";
import { AdPreview } from "@/components/ad-preview";
import { DownloadDialog } from "@/components/download-dialog";
import { TemplateSelector } from "@/components/template-selector";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GenerateAdRequest } from "@shared/schema";

export default function Dashboard() {
  const [productImage, setProductImage] = useState<string>("");
  const [audience, setAudience] = useState({
    ageMin: 18,
    ageMax: 35,
    gender: "male" as "male" | "female" | "all",
    persona: "hip, young, professional",
  });
  const [adText, setAdText] = useState("25% off for winter");
  const [templateId, setTemplateId] = useState<string>("");
  const [productDisplay, setProductDisplay] = useState<"standalone" | "on-person">("standalone");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [showDownload, setShowDownload] = useState(false);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateAdRequest) => {
      const response = await apiRequest(
        "POST",
        "/api/generate-ad",
        data
      );
      return response.json();
    },
    onSuccess: (data: { imageUrl: string }) => {
      setGeneratedImageUrl(data.imageUrl);
      toast({
        title: "Ad Generated!",
        description: "Your professional ad creative is ready to download.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate ad. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!productImage) {
      toast({
        title: "Product Image Required",
        description: "Please upload a product image first.",
        variant: "destructive",
      });
      return;
    }

    if (!audience.persona || audience.persona.length < 10) {
      toast({
        title: "Audience Persona Required",
        description: "Please describe your target audience (at least 10 characters).",
        variant: "destructive",
      });
      return;
    }

    if (!adText) {
      toast({
        title: "Ad Text Required",
        description: "Please enter your ad headline or message.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      productImageUrl: productImage,
      targetAudience: audience,
      adText,
      templateId: templateId || undefined,
      productDisplay,
    });
  };

  const canGenerate = productImage && audience.persona.length >= 10 && adText;
  const isGenerating = generateMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3" data-testid="text-app-title">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                Ad Creative Generator
              </h1>
              <p className="mt-2 text-muted-foreground" data-testid="text-app-subtitle">
                Create professional Instagram and Facebook ads with AI
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-display font-semibold" data-testid="text-upload-title">
                  Product Image
                </h2>
              </div>
              <ProductUpload
                value={productImage}
                onChange={setProductImage}
              />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-green-500" />
                </div>
                <h2 className="text-xl font-display font-semibold" data-testid="text-display-title">
                  Product Display
                </h2>
              </div>
              <RadioGroup
                value={productDisplay}
                onValueChange={(value) => setProductDisplay(value as "standalone" | "on-person")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate active-elevate-2 cursor-pointer" data-testid="radio-standalone">
                  <RadioGroupItem value="standalone" id="standalone" />
                  <Label htmlFor="standalone" className="cursor-pointer flex-1">
                    <div className="font-medium">Standalone Product</div>
                    <div className="text-sm text-muted-foreground">Show product by itself</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate active-elevate-2 cursor-pointer" data-testid="radio-on-person">
                  <RadioGroupItem value="on-person" id="on-person" />
                  <Label htmlFor="on-person" className="cursor-pointer flex-1">
                    <div className="font-medium">On a Person</div>
                    <div className="text-sm text-muted-foreground">Show product being worn or used</div>
                  </Label>
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-display font-semibold" data-testid="text-audience-title">
                  Target Audience
                </h2>
              </div>
              <AudienceForm
                value={audience}
                onChange={setAudience}
              />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-xl font-display font-semibold" data-testid="text-adtext-title">
                  Ad Text
                </h2>
              </div>
              <AdTextEditor
                value={adText}
                onChange={setAdText}
              />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-purple-500" />
                </div>
                <h2 className="text-xl font-display font-semibold" data-testid="text-template-title">
                  Design Template
                </h2>
              </div>
              <TemplateSelector
                value={templateId}
                onChange={setTemplateId}
              />
            </Card>

            <div className="relative">
              <Button
                size="lg"
                className="w-full h-14 text-lg font-display font-semibold"
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                data-testid="button-generate"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Ad Creative
                  </>
                )}
              </Button>
              {!canGenerate && !isGenerating && (
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  Complete all fields to generate your ad
                </p>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-semibold" data-testid="text-preview-title">
                  Preview
                </h2>
                {generatedImageUrl && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowDownload(true)}
                    data-testid="button-download"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
              <AdPreview
                imageUrl={generatedImageUrl}
                isGenerating={generateMutation.isPending}
              />
            </Card>
          </div>
        </div>
      </main>

      <DownloadDialog
        open={showDownload}
        onOpenChange={setShowDownload}
        imageUrl={generatedImageUrl}
      />
    </div>
  );
}
