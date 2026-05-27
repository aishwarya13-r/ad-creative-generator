import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AdTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdTextEditor({ value, onChange }: AdTextEditorProps) {
  const characterCount = value.length;
  const maxLength = 200;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <div className="space-y-3">
      <Label htmlFor="ad-text" className="text-sm font-medium">
        Headline / Main Message
      </Label>
      <Textarea
        id="ad-text"
        placeholder="Enter your compelling ad headline or main message... (e.g., 'Transform Your Workspace Today', 'Limited Time Offer - 50% Off')"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-28 resize-none text-base"
        maxLength={maxLength}
        data-testid="textarea-ad-text"
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Keep it short and impactful for better engagement
        </p>
        <p
          className={`text-xs font-medium ${
            isNearLimit ? "text-destructive" : "text-muted-foreground"
          }`}
          data-testid="text-character-count"
        >
          {characterCount}/{maxLength}
        </p>
      </div>
    </div>
  );
}
