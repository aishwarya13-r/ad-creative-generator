import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Instagram, Facebook } from "lucide-react";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
}

export function DownloadDialog({ open, onOpenChange, imageUrl }: DownloadDialogProps) {
  const resizeImage = (format: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        // For original format, just return the image as-is
        if (format === "original") {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
          return;
        }
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Define target dimensions based on format
        let targetWidth: number, targetHeight: number;
        switch (format) {
          case "instagram-square":
            targetWidth = 1080;
            targetHeight = 1080;
            break;
          case "instagram-story":
            targetWidth = 1080;
            targetHeight = 1920;
            break;
          case "facebook-feed":
            targetWidth = 1080;
            targetHeight = 1350;
            break;
          default:
            targetWidth = 1080;
            targetHeight = 1080;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Calculate scaling to COVER the canvas while maintaining aspect ratio (crops to fill)
        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;
        
        let drawWidth: number, drawHeight: number, offsetX = 0, offsetY = 0;
        
        if (imgAspect > targetAspect) {
          // Image is wider than target, scale by height and crop sides
          drawHeight = targetHeight;
          drawWidth = drawHeight * imgAspect;
          offsetX = (targetWidth - drawWidth) / 2;
        } else {
          // Image is taller than target, scale by width and crop top/bottom
          drawWidth = targetWidth;
          drawHeight = drawWidth / imgAspect;
          offsetY = (targetHeight - drawHeight) / 2;
        }
        
        // Draw image centered and scaled to cover (fills entire canvas)
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        resolve(canvas.toDataURL("image/png"));
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageUrl;
    });
  };

  const handleDownload = async (format: string) => {
    if (!imageUrl) return;

    try {
      const resizedDataUrl = await resizeImage(format);
      
      const link = document.createElement("a");
      link.href = resizedDataUrl;
      link.download = `ad-creative-${format}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to resize image:", error);
      // Fallback to original image
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `ad-creative-${format}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-download">
        <DialogHeader>
          <DialogTitle className="font-display">Download Your Ad</DialogTitle>
          <DialogDescription>
            Choose the format optimized for your social media platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <Button
            variant="outline"
            className="w-full h-14 justify-start text-left gap-3"
            onClick={() => handleDownload("original")}
            data-testid="button-download-original"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Original (Full Image)</p>
              <p className="text-xs text-muted-foreground">Download as generated - no cropping</p>
            </div>
            <Download className="w-4 h-4 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 justify-start text-left gap-3"
            onClick={() => handleDownload("instagram-square")}
            data-testid="button-download-instagram-square"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Instagram Square Post</p>
              <p className="text-xs text-muted-foreground">1:1 aspect ratio (may crop edges)</p>
            </div>
            <Download className="w-4 h-4 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 justify-start text-left gap-3"
            onClick={() => handleDownload("instagram-story")}
            data-testid="button-download-instagram-story"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Instagram Story</p>
              <p className="text-xs text-muted-foreground">9:16 aspect ratio (may crop edges)</p>
            </div>
            <Download className="w-4 h-4 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 justify-start text-left gap-3"
            onClick={() => handleDownload("facebook-feed")}
            data-testid="button-download-facebook"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Facebook className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Facebook Feed</p>
              <p className="text-xs text-muted-foreground">4:5 aspect ratio (may crop edges)</p>
            </div>
            <Download className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Images are optimized for high-quality social media posting
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
