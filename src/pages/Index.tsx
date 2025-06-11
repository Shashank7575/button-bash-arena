
import { useState } from "react";
import { Gamepad2, Dices, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SnakeGame } from "@/components/games/SnakeGame";
import { TicTacToe } from "@/components/games/TicTacToe";
import { ButtonBashArena } from "@/components/games/ButtonBashArena";

const Index = () => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const games = [
    {
      id: "snake",
      title: "Snake Classic",
      description: "Navigate the snake to eat food and grow longer. Don't hit the walls!",
      icon: <Dices className="w-8 h-8" />,
      component: <SnakeGame onBack={() => setCurrentGame(null)} />
    },
    {
      id: "tictactoe",
      title: "Tic-Tac-Toe",
      description: "Classic strategy game. Beat the AI or play with a friend!",
      icon: <Grid3X3 className="w-8 h-8" />,
      component: <TicTacToe onBack={() => setCurrentGame(null)} />
    },
    {
      id: "buttonbash",
      title: "Button Bash Arena",
      description: "Test your reflexes! Click the buttons as fast as you can!",
      icon: <Gamepad2 className="w-8 h-8" />,
      component: <ButtonBashArena onBack={() => setCurrentGame(null)} />
    }
  ];

  if (currentGame) {
    const game = games.find(g => g.id === currentGame);
    return game ? game.component : null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent animate-float">
            Game Arena
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Choose your challenge and test your skills!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="game-card group cursor-pointer" onClick={() => setCurrentGame(game.id)}>
              <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-lg mb-4 mx-auto group-hover:animate-pulse-glow">
                {game.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-center">{game.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 text-center">{game.description}</p>
              <Button className="w-full game-button">
                Play Now
              </Button>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-12 md:mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Why Choose Game Arena?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 md:p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Classic Games</h3>
              <p className="text-sm md:text-base text-muted-foreground">Enjoy timeless games with modern design</p>
            </div>
            <div className="p-4 md:p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Dices className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Mobile Ready</h3>
              <p className="text-sm md:text-base text-muted-foreground">Optimized for touch controls and mobile devices</p>
            </div>
            <div className="p-4 md:p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Grid3X3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Responsive</h3>
              <p className="text-sm md:text-base text-muted-foreground">Perfect gaming experience on any device</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
