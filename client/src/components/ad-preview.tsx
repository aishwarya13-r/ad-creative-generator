import { Loader2 } from "lucide-react";

interface AdPreviewProps {
  imageUrl: string;
  isGenerating: boolean;
}

export function AdPreview({ imageUrl, isGenerating }: AdPreviewProps) {
  if (isGenerating) {
    return (
      <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 flex flex-col items-center justify-center gap-4" data-testid="div-generating">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-center">
          <p className="text-lg font-display font-semibold text-foreground">
            Generating Your Ad
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            AI is creating your professional ad creative...
          </p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-4 bg-muted/20" data-testid="div-empty-preview">
        <svg
          className="w-16 h-16 text-muted-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <div className="text-center px-4">
          <p className="text-lg font-display font-semibold text-foreground">
            No Preview Yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Fill out the form and click Generate to see your ad
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" data-testid="div-preview">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black shadow-lg">
        <img
          src={imageUrl}
          alt="Generated Ad"
          className="w-full h-full object-cover"
          data-testid="img-generated-ad"
        />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Ready to download</span>
        <span className="text-xs text-muted-foreground">1:1 Instagram Format</span>
      </div>
    </div>
  );
}
