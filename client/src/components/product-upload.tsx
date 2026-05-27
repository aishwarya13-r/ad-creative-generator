import { useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ProductUpload({ value, onChange }: ProductUploadProps) {
  const { toast } = useToast();

  const validateAndLoadImage = useCallback((file: File) => {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Image Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        // Check minimum dimensions
        if (img.width < 100 || img.height < 100) {
          toast({
            title: "Image Too Small",
            description: "Please upload an image at least 100x100 pixels for best results.",
            variant: "destructive",
          });
          return;
        }

        // Image is valid, proceed with upload
        onChange(reader.result as string);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, [onChange, toast]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndLoadImage(file);
    }
  }, [validateAndLoadImage]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      validateAndLoadImage(file);
    }
  }, [validateAndLoadImage]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div>
      {!value ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center hover-elevate active-elevate-2 cursor-pointer transition-all"
          data-testid="div-upload-zone"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="product-upload"
            data-testid="input-product-image"
          />
          <label htmlFor="product-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground mb-1">
                  Drop your product image here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (PNG, JPG, WebP)
                </p>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative group" data-testid="div-product-preview">
          <div className="relative rounded-xl overflow-hidden border-2 border-border bg-muted/30">
            <img
              src={value}
              alt="Product"
              className="w-full h-64 object-contain"
              data-testid="img-product"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onChange("")}
            data-testid="button-remove-image"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
            <span>Product image uploaded</span>
          </div>
        </div>
      )}
    </div>
  );
}
