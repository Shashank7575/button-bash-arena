
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
      x: Math.random() * 80 + 5, // 5% to 85% to keep buttons in bounds
      y: Math.random() * 80 + 5,
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
      description: "Click the glowing buttons as fast as you can!"
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
    const buttonCount = Math.random() > 0.7 ? 2 : 1; // 30% chance for 2 buttons
    
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
          // Remove buttons after 3 seconds
          return now - (button.id * 1000) < 3000;
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
    <div className="min-h-screen p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
          <div className="flex gap-6 text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Score: {score}
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-red-500" />
              Time: {timeLeft}s
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-primary">Button Bash Arena</h1>
          <p className="text-muted-foreground">
            Click the glowing buttons before they disappear!
          </p>
          {highScore > 0 && (
            <p className="text-primary font-semibold mt-2">
              High Score: {highScore}
            </p>
          )}
        </div>

        {!isPlaying && !gameOver && (
          <div className="text-center mb-8">
            <Button onClick={startGame} className="game-button text-xl px-8 py-4">
              Start Game
            </Button>
          </div>
        )}

        {isPlaying && (
          <div 
            className="relative bg-card border border-border rounded-lg mx-auto mb-6 overflow-hidden"
            style={{ width: '600px', height: '400px' }}
          >
            {gameButtons.map(button => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                className="absolute w-16 h-16 bg-primary hover:bg-primary/80 rounded-full animate-pulse-glow transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center text-white font-bold text-lg"
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
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Waiting for buttons...
              </div>
            )}
          </div>
        )}

        {gameOver && (
          <div className="text-center p-8 bg-card border border-border rounded-lg mb-6">
            <h2 className="text-3xl font-bold mb-4 text-primary">Game Over!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
              <div>
                <div className="text-2xl font-bold text-primary">{score}</div>
                <div className="text-muted-foreground">Final Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{clicks}</div>
                <div className="text-muted-foreground">Total Clicks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{accuracy}%</div>
                <div className="text-muted-foreground">Accuracy</div>
              </div>
            </div>
            <Button onClick={startGame} className="game-button flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>
        )}

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center">1</div>
              <p>Click the glowing buttons as fast as you can</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center">2</div>
              <p>Buttons disappear after 3 seconds</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center">3</div>
              <p>Score as many points as possible in 30 seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
