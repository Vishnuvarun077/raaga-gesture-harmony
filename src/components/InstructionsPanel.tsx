import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageTexts } from "@/data/languages";

interface InstructionsPanelProps {
  texts: LanguageTexts;
}

export function InstructionsPanel({ texts }: InstructionsPanelProps) {
  const instructionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1
      }
    })
  };

  const leftHandInstructions = [
    texts.instruction1,
    texts.instruction2,
    texts.instruction3,
    texts.instruction4
  ];

  const rightHandInstructions = [
    texts.instruction5,
    texts.instruction6,
    texts.instruction7,
    texts.instruction8
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Card className="bg-gradient-surface border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-raga-primary flex items-center gap-2">
            {texts.instructionsTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Hand Instructions */}
            <div>
              <h4 className="text-raga-secondary font-medium mb-3">
                {texts.leftHandTitle}
              </h4>
              <ul className="space-y-2">
                {leftHandInstructions.map((instruction, index) => (
                  <motion.li
                    key={index}
                    custom={index}
                    variants={instructionVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-muted-foreground text-sm flex items-center"
                  >
                    <span className="w-2 h-2 bg-raga-primary rounded-full mr-3 flex-shrink-0" />
                    {instruction}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right Hand Instructions */}
            <div>
              <h4 className="text-raga-secondary font-medium mb-3">
                {texts.rightHandTitle}
              </h4>
              <ul className="space-y-2">
                {rightHandInstructions.map((instruction, index) => (
                  <motion.li
                    key={index + 4}
                    custom={index + 4}
                    variants={instructionVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-muted-foreground text-sm flex items-center"
                  >
                    <span className="w-2 h-2 bg-raga-accent rounded-full mr-3 flex-shrink-0" />
                    {instruction}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}