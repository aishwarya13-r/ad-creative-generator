import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface AudienceFormProps {
  value: {
    ageMin: number;
    ageMax: number;
    gender: "male" | "female" | "all";
    persona: string;
  };
  onChange: (value: AudienceFormProps["value"]) => void;
}

export function AudienceForm({ value, onChange }: AudienceFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block" data-testid="label-age-range">
          Age Range: {value.ageMin} - {value.ageMax}
        </Label>
        <div className="space-y-3">
          <Slider
            min={0}
            max={100}
            step={1}
            value={[value.ageMin, value.ageMax]}
            onValueChange={([min, max]) =>
              onChange({ ...value, ageMin: min, ageMax: max })
            }
            className="py-4"
            data-testid="slider-age-range"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">
          Gender
        </Label>
        <RadioGroup
          value={value.gender}
          onValueChange={(gender: "male" | "female" | "all") =>
            onChange({ ...value, gender })
          }
          data-testid="radiogroup-gender"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="gender-all" data-testid="radio-gender-all" />
            <Label htmlFor="gender-all" className="font-normal cursor-pointer">
              All
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="gender-male" data-testid="radio-gender-male" />
            <Label htmlFor="gender-male" className="font-normal cursor-pointer">
              Male
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="gender-female" data-testid="radio-gender-female" />
            <Label htmlFor="gender-female" className="font-normal cursor-pointer">
              Female
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="persona" className="text-sm font-medium mb-2 block">
          Target Persona
        </Label>
        <Textarea
          id="persona"
          placeholder="Describe your ideal customer... (e.g., young professionals who value sustainability, tech-savvy millennials looking for convenience)"
          value={value.persona}
          onChange={(e) => onChange({ ...value, persona: e.target.value })}
          className="min-h-24 resize-none"
          maxLength={500}
          data-testid="textarea-persona"
        />
        <p className="mt-2 text-xs text-muted-foreground text-right" data-testid="text-persona-count">
          {value.persona.length}/500
        </p>
      </div>
    </div>
  );
}
