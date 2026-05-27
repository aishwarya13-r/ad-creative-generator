import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check } from "lucide-react";
import type { AdTemplate } from "@shared/schema";

interface TemplateSelectorProps {
  value: string;
  onChange: (templateId: string) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const { data, isLoading } = useQuery<{ templates: AdTemplate[] }>({
    queryKey: ["/api/templates"],
  });

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading templates...
      </div>
    );
  }

  const templates = data?.templates || [];

  return (
    <div className="space-y-4" data-testid="div-template-selector">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover-elevate active-elevate-2 ${
              value === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onChange(template.id)}
            data-testid={`card-template-${template.style}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {template.style}
              </Badge>
              {value === template.id && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="w-3 h-3" />
        <span>Templates customize the visual style of your ad creative</span>
      </div>
    </div>
  );
}
