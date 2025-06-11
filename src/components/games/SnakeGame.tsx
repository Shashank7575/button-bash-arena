
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onBack: () => void;
}

export const SnakeGame = ({ onBack }: SnakeGameProps) => {
  const { toast } = useToast();
  const GRID_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 10, y: 10 }];
  const INITIAL_FOOD = { x: 15, y: 15 };

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake, isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    toast({
      title: "Game Started!",
      description: "Use arrow keys or WASD to control the snake"
    });
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
          <div className="text-2xl font-bold">Score: {score}</div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-primary">Snake Classic</h1>
          <p className="text-muted-foreground">
            Use arrow keys or WASD to control the snake
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div 
            className="grid bg-card border border-border rounded-lg p-4"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gap: '1px',
              width: '400px',
              height: '400px'
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

        <div className="flex gap-4 justify-center">
          {!isPlaying && !gameOver && (
            <Button onClick={startGame} className="game-button">
              Start Game
            </Button>
          )}
          {gameOver && (
            <Button onClick={resetGame} className="game-button flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          )}
          {isPlaying && (
            <Button onClick={() => setIsPlaying(false)} variant="outline">
              Pause
            </Button>
          )}
        </div>

        {gameOver && (
          <div className="text-center mt-6 p-6 bg-card border border-border rounded-lg">
            <h2 className="text-2xl font-bold text-destructive mb-2">Game Over!</h2>
            <p className="text-muted-foreground">Final Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
};
