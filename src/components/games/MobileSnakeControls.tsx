
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface MobileSnakeControlsProps {
  onDirectionChange: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  disabled: boolean;
}

export const MobileSnakeControls = ({ onDirectionChange, disabled }: MobileSnakeControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => onDirectionChange('UP')}
        disabled={disabled}
        className="w-16 h-16 p-0"
      >
        <ArrowUp className="w-6 h-6" />
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onDirectionChange('LEFT')}
          disabled={disabled}
          className="w-16 h-16 p-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => onDirectionChange('DOWN')}
          disabled={disabled}
          className="w-16 h-16 p-0"
        >
          <ArrowDown className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => onDirectionChange('RIGHT')}
          disabled={disabled}
          className="w-16 h-16 p-0"
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
