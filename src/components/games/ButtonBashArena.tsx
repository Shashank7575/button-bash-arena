import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Timer, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ButtonBashArenaProps {
  onBack: () => void;
}

interface GameButton {
  id: number;
  x: number;
  y: number;
  active: boolean;
}

export const ButtonBashArena = ({ onBack }: ButtonBashArenaProps) => {
  const { toast } = useToast();
  const [gameButtons, setGameButtons] = useState<GameButton[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [clicks, setClicks] = useState(0);

  const generateButton = useCallback((): GameButton => {
    return {
      id: Math.random(),
      x: Math.random() * 70 + 10, // More padding for mobile
      y: Math.random() * 70 + 10,
      active: true
    };
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setClicks(0);
    setTimeLeft(30);
    setGameButtons([generateButton()]);
    toast({
      title: "Game Started!",
      description: "Tap the glowing buttons!"
    });
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
    setGameButtons([]);
    
    if (score > highScore) {
      setHighScore(score);
      toast({
        title: "New High Score!",
        description: `Amazing! You scored ${score} points! 🎉`
      });
    } else {
      toast({
        title: "Game Over!",
        description: `Final Score: ${score} points`
      });
    }
  }, [score, highScore, toast]);

  const handleButtonClick = (buttonId: number) => {
    if (!isPlaying) return;

    setGameButtons(prev => prev.filter(btn => btn.id !== buttonId));
    setScore(prev => prev + 10);
    setClicks(prev => prev + 1);
    
    // Add new button(s)
    const newButtons = [];
    const buttonCount = Math.random() > 0.7 ? 2 : 1;
    
    for (let i = 0; i < buttonCount; i++) {
      newButtons.push(generateButton());
    }
    
    setTimeout(() => {
      setGameButtons(prev => [...prev, ...newButtons]);
    }, 200);
  };

  // Game timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, endGame]);

  // Remove buttons that stay too long
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setGameButtons(prev => {
        const now = Date.now();
        return prev.filter(button => {
          return now - (button.id * 1000) < 2500; // Shorter time for mobile
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const resetGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setClicks(0);
    setTimeLeft(30);
    setGameButtons([]);
  };

  const accuracy = clicks > 0 ? Math.round((score / 10 / clicks) * 100) : 0;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex gap-4 text-sm font-semibold">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-primary" />
              {score}
            </div>
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4 text-red-500" />
              {timeLeft}s
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold mb-2 text-primary">Button Bash Arena</h1>
          <p className="text-sm text-muted-foreground">
            Tap the glowing buttons before they disappear!
          </p>
          {highScore > 0 && (
            <p className="text-primary font-semibold mt-1 text-sm">
              High Score: {highScore}
            </p>
          )}
        </div>

        {!isPlaying && !gameOver && (
          <div className="text-center mb-6">
            <Button onClick={startGame} className="game-button w-full">
              Start Game
            </Button>
          </div>
        )}

        {isPlaying && (
          <div 
            className="relative bg-card border border-border rounded-lg mx-auto mb-6 overflow-hidden touch-none"
            style={{ width: '100%', height: '350px' }}
          >
            {gameButtons.map(button => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                className="absolute w-14 h-14 bg-primary hover:bg-primary/80 rounded-full animate-pulse-glow transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center text-white font-bold text-lg touch-manipulation"
                style={{
                  left: `${button.x}%`,
                  top: `${button.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {Math.floor(Math.random() * 9) + 1}
              </button>
            ))}
            
            {gameButtons.length === 0 && isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Waiting for buttons...
              </div>
            )}
          </div>
        )}

        {gameOver && (
          <div className="text-center p-6 bg-card border border-border rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">Game Over!</h2>
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <div className="text-xl font-bold text-primary">{score}</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
              <div>
                <div className="text-xl font-bold text-primary">{clicks}</div>
                <div className="text-xs text-muted-foreground">Clicks</div>
              </div>
              <div>
                <div className="text-xl font-bold text-primary">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>
            <Button onClick={startGame} className="game-button w-full flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>
        )}

        <div className="text-center">
          <h3 className="text-lg font-semibold mb-3">How to Play</h3>
          <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground">
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="w-6 h-6 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center text-xs">1</div>
              <p>Tap glowing buttons as fast as you can</p>
            </div>
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="w-6 h-6 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center text-xs">2</div>
              <p>Buttons disappear after 2.5 seconds</p>
            </div>
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="w-6 h-6 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center text-xs">3</div>
              <p>Score as many points as possible in 30 seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
