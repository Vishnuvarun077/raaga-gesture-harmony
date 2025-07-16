import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Music, Drum, Volume2, ArrowUpDown } from "lucide-react";
import { ragas, talas } from "@/data/musicData";
import { LanguageTexts } from "@/data/languages";

interface ControlPanelProps {
  texts: LanguageTexts;
  selectedRaga: string;
  onRagaChange: (raga: string) => void;
  selectedTala: string;
  onTalaChange: (tala: string) => void;
  isTanpuraPlaying: boolean;
  onTanpuraToggle: () => void;
  tanpuraVolume: number;
  onVolumeChange: (volume: number) => void;
  octave: number;
  onOctaveChange: (octave: number) => void;
}

export function ControlPanel({
  texts,
  selectedRaga,
  onRagaChange,
  selectedTala,
  onTalaChange,
  isTanpuraPlaying,
  onTanpuraToggle,
  tanpuraVolume,
  onVolumeChange,
  octave,
  onOctaveChange
}: ControlPanelProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Raga Selection */}
      <motion.div variants={cardVariants}>
        <Card className="bg-gradient-surface border-border hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-raga-primary">
              <Music className="w-4 h-4" />
              {texts.ragaTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedRaga} onValueChange={onRagaChange}>
              <SelectTrigger className="bg-raga-surface border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ragas).map(([key, raga]) => (
                  <SelectItem key={key} value={key}>
                    {raga.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 text-xs text-muted-foreground">
              {ragas[selectedRaga]?.description}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tala Selection */}
      <motion.div variants={cardVariants}>
        <Card className="bg-gradient-surface border-border hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-raga-primary">
              <Drum className="w-4 h-4" />
              {texts.talaTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTala} onValueChange={onTalaChange}>
              <SelectTrigger className="bg-raga-surface border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(talas).map(([key, tala]) => (
                  <SelectItem key={key} value={key}>
                    {tala.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex justify-center space-x-1">
              {talas[selectedTala]?.pattern.map((beat, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    beat ? 'bg-raga-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tanpura Controls */}
      <motion.div variants={cardVariants}>
        <Card className="bg-gradient-surface border-border hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-raga-primary">
              <Volume2 className="w-4 h-4" />
              {texts.tanpuraTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={onTanpuraToggle}
              className={`w-full mb-3 ${
                isTanpuraPlaying
                  ? 'bg-destructive hover:bg-destructive/90'
                  : 'bg-gradient-accent hover:opacity-90'
              }`}
            >
              {isTanpuraPlaying ? texts.tanpuraBtnStop : texts.tanpuraBtnStart}
            </Button>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                {texts.volumeLabel}
              </label>
              <Slider
                value={[tanpuraVolume]}
                onValueChange={(value) => onVolumeChange(value[0])}
                min={-60}
                max={0}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Octave Selection */}
      <motion.div variants={cardVariants}>
        <Card className="bg-gradient-surface border-border hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-raga-primary">
              <ArrowUpDown className="w-4 h-4" />
              {texts.octaveTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[
                { value: 3, label: texts.mandraText },
                { value: 4, label: texts.madhyaText },
                { value: 5, label: texts.taraText }
              ].map((oct) => (
                <Button
                  key={oct.value}
                  size="sm"
                  variant={octave === oct.value ? "default" : "secondary"}
                  onClick={() => onOctaveChange(oct.value)}
                  className={`flex-1 ${
                    octave === oct.value
                      ? 'bg-gradient-accent text-black shadow-glow'
                      : 'bg-raga-surface hover:bg-raga-surface-elevated'
                  }`}
                >
                  {oct.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}