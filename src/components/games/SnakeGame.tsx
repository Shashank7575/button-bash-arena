import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MobileSnakeControls } from "./MobileSnakeControls";

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onBack: () => void;
}

export const SnakeGame = ({ onBack }: SnakeGameProps) => {
  const { toast } = useToast();
  const GRID_SIZE = 15; // Smaller grid for mobile
  const INITIAL_SNAKE = [{ x: 7, y: 7 }];
  const INITIAL_FOOD = { x: 10, y: 10 };

  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        toast({
          title: "Game Over!",
          description: `Final Score: ${score}`,
          variant: "destructive"
        });
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        toast({
          title: "Game Over!",
          description: `Final Score: ${score}`,
          variant: "destructive"
        });
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(prev => prev + 10);
        toast({
          title: "Food eaten!",
          description: "+10 points"
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood, isPlaying, score, toast]);

  const handleDirectionChange = (newDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (!isPlaying || gameOver) return;

    // Prevent reverse direction
    if (
      (direction === 'UP' && newDirection === 'DOWN') ||
      (direction === 'DOWN' && newDirection === 'UP') ||
      (direction === 'LEFT' && newDirection === 'RIGHT') ||
      (direction === 'RIGHT' && newDirection === 'LEFT')
    ) {
      return;
    }

    setDirection(newDirection);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleDirectionChange('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleDirectionChange('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleDirectionChange('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(moveSnake, 200); // Slightly slower for mobile
    return () => clearInterval(gameLoop);
  }, [moveSnake, isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    toast({
      title: "Game Started!",
      description: "Use controls below or keyboard to play"
    });
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-lg font-bold">Score: {score}</div>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold mb-2 text-primary">Snake Classic</h1>
          <p className="text-sm text-muted-foreground">
            Use controls below or keyboard to play
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <div 
            className="grid bg-card border border-border rounded-lg p-2"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gap: '1px',
              width: '300px',
              height: '300px'
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isHead = snake[0]?.x === x && snake[0]?.y === y;
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`
                    w-full h-full rounded-sm
                    ${isFood ? 'bg-red-500 animate-pulse' : ''}
                    ${isSnake ? (isHead ? 'bg-primary' : 'bg-primary/70') : 'bg-muted/20'}
                  `}
                />
              );
            })}
          </div>
        </div>

        <MobileSnakeControls 
          onDirectionChange={handleDirectionChange}
          disabled={!isPlaying || gameOver}
        />

        <div className="flex gap-2 justify-center mt-4">
          {!isPlaying && !gameOver && (
            <Button onClick={startGame} className="game-button flex-1">
              Start Game
            </Button>
          )}
          {gameOver && (
            <Button onClick={resetGame} className="game-button flex items-center gap-2 flex-1">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          )}
          {isPlaying && (
            <Button onClick={() => setIsPlaying(false)} variant="outline" className="flex-1">
              Pause
            </Button>
          )}
        </div>

        {gameOver && (
          <div className="text-center mt-4 p-4 bg-card border border-border rounded-lg">
            <h2 className="text-xl font-bold text-destructive mb-2">Game Over!</h2>
            <p className="text-muted-foreground">Final Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
};
