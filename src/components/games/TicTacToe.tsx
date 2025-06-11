
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TicTacToeProps {
  onBack: () => void;
}

type Player = 'X' | 'O' | null;

export const TicTacToe = ({ onBack }: TicTacToeProps) => {
  const { toast } = useToast();
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'Player' | 'AI' | 'Draw' | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const checkWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const checkDraw = (squares: Player[]): boolean => {
    return squares.every(square => square !== null);
  };

  const getAIMove = (squares: Player[]): number => {
    // Simple AI: Check for winning move, then blocking move, then random
    const availableSpots = squares.map((spot, index) => spot === null ? index : null).filter(val => val !== null) as number[];
    
    // Check if AI can win
    for (const spot of availableSpots) {
      const testBoard = [...squares];
      testBoard[spot] = 'O';
      if (checkWinner(testBoard) === 'O') {
        return spot;
      }
    }

    // Check if AI needs to block player
    for (const spot of availableSpots) {
      const testBoard = [...squares];
      testBoard[spot] = 'X';
      if (checkWinner(testBoard) === 'X') {
        return spot;
      }
    }

    // Take center if available
    if (squares[4] === null) return 4;

    // Take random available spot
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const playerWon = checkWinner(newBoard);
    if (playerWon === 'X') {
      setWinner('Player');
      setGameOver(true);
      setPlayerScore(prev => prev + 1);
      toast({
        title: "You Win!",
        description: "Congratulations! 🎉"
      });
      return;
    }

    if (checkDraw(newBoard)) {
      setWinner('Draw');
      setGameOver(true);
      toast({
        title: "It's a Draw!",
        description: "Good game!"
      });
      return;
    }

    setIsPlayerTurn(false);

    // AI move after a short delay
    setTimeout(() => {
      const aiMove = getAIMove(newBoard);
      if (aiMove !== undefined) {
        newBoard[aiMove] = 'O';
        setBoard([...newBoard]);

        const aiWon = checkWinner(newBoard);
        if (aiWon === 'O') {
          setWinner('AI');
          setGameOver(true);
          setAiScore(prev => prev + 1);
          toast({
            title: "AI Wins!",
            description: "Better luck next time!",
            variant: "destructive"
          });
          return;
        }

        if (checkDraw(newBoard)) {
          setWinner('Draw');
          setGameOver(true);
          toast({
            title: "It's a Draw!",
            description: "Good game!"
          });
          return;
        }

        setIsPlayerTurn(true);
      }
    }, 500);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
  };

  const resetScores = () => {
    resetGame();
    setPlayerScore(0);
    setAiScore(0);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
          <div className="flex gap-6 text-lg font-semibold">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              You: {playerScore}
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-red-500" />
              AI: {aiScore}
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-primary">Tic-Tac-Toe</h1>
          <p className="text-muted-foreground">
            {gameOver 
              ? `Game Over - ${winner === 'Draw' ? "It's a draw!" : `${winner} wins!`}`
              : isPlayerTurn 
                ? "Your turn (X)" 
                : "AI is thinking... (O)"
            }
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-3 gap-2 p-4 bg-card border border-border rounded-lg">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                disabled={cell !== null || gameOver || !isPlayerTurn}
                className="w-20 h-20 bg-muted/20 hover:bg-muted/40 border border-border rounded-lg flex items-center justify-center text-3xl font-bold transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {cell && (
                  <span className={cell === 'X' ? 'text-primary' : 'text-red-500'}>
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={resetGame} className="game-button flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
          <Button onClick={resetScores} variant="outline">
            Reset Scores
          </Button>
        </div>

        {winner && (
          <div className="text-center mt-6 p-6 bg-card border border-border rounded-lg">
            <h2 className={`text-2xl font-bold mb-2 ${winner === 'Player' ? 'text-primary' : winner === 'AI' ? 'text-red-500' : 'text-muted-foreground'}`}>
              {winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}
            </h2>
            <p className="text-muted-foreground">
              {winner === 'Player' && "Great job! You beat the AI! 🎉"}
              {winner === 'AI' && "The AI got you this time! Try again! 🤖"}
              {winner === 'Draw' && "An evenly matched game! 🤝"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
