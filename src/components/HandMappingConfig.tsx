import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useHandMappingConfig, HandMappingDirection } from "@/hooks/useHandMappingConfig";
import { Language } from "@/components/LanguageSwitcher";
import { languages } from "@/data/languages";

interface HandMappingConfigProps {
  currentLanguage: Language;
  onConfigChange?: (config: any) => void;
}

export function HandMappingConfig({ currentLanguage, onConfigChange }: HandMappingConfigProps) {
  const { config, updateDirection } = useHandMappingConfig();
  const texts = languages[currentLanguage];

  const handleDirectionChange = (value: string) => {
    const direction = value as HandMappingDirection;
    updateDirection(direction);
    onConfigChange?.(config);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-raga-surface/80 backdrop-blur-sm">
          <Settings className="h-4 w-4 mr-2" />
          {texts.handMapping}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{texts.handMappingConfig}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {texts.mappingDirection}
            </label>
            <Select value={config.direction} onValueChange={handleDirectionChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left-to-right">{texts.leftToRight}</SelectItem>
                <SelectItem value="right-to-left">{texts.rightToLeft}</SelectItem>
                <SelectItem value="cyclic">{texts.cyclic}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{texts.leftHand}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 text-xs">
                  {['Index', 'Middle', 'Ring', 'Pinky'].map((finger, index) => (
                    <div key={finger} className="flex justify-between">
                      <span>{finger}:</span>
                      <span className="font-medium">
                        {config.leftHandSwaras[index] || '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{texts.rightHand}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 text-xs">
                  {['Index', 'Middle', 'Ring', 'Pinky'].map((finger, index) => (
                    <div key={finger} className="flex justify-between">
                      <span>{finger}:</span>
                      <span className="font-medium">
                        {config.rightHandSwaras[index] || '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}