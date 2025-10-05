import { z } from 'zod';
import { Extension } from '../types/extensions';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RotateCcw, Gamepad2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const coinFlipGameSchema = z.object({
    rounds: z.number().min(1).max(10).default(5),
});

type GameState = 'setup' | 'flipping' | 'result';

const coinFlipGameRenderer = ({
    rounds = 5,
    onInteract,
}: Partial<z.infer<typeof coinFlipGameSchema>> & {
    onInteract: (interaction: string, props: unknown[]) => void;
}) => {
    const [gameState, setGameState] = useState<GameState>('setup');
    const [currentRound, setCurrentRound] = useState(0);
    const [wins, setWins] = useState(0);
    const [playerChoice, setPlayerChoice] = useState<'heads' | 'tails' | null>(null);
    const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);

    const startFlip = (choice: 'heads' | 'tails') => {
        setPlayerChoice(choice);
        setGameState('flipping');

        // Flip animation delay
        setTimeout(() => {
            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            setCoinResult(result);

            if (choice === result) {
                setWins((prev) => prev + 1);
            }

            setGameState('result');
        }, 500);
    };

    const nextRound = () => {
        if (currentRound + 1 >= rounds) {
            // Game complete
            if (onInteract) onInteract('coin-flip-game-ended', [wins, rounds, Math.round((wins / rounds) * 100)]);
            return;
        }
        setCurrentRound((prev) => prev + 1);
        setPlayerChoice(null);
        setCoinResult(null);
        setGameState('setup');
    };

    const resetGame = () => {
        setCurrentRound(0);
        setWins(0);
        setPlayerChoice(null);
        setCoinResult(null);
        setGameState('setup');
    };

    const isGameComplete = currentRound >= rounds;

    return (
        <Card>
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <Label>
                        <Gamepad2 className="size-4" /> Coin Flip Game
                    </Label>
                    <Button variant="outline" size="sm" onClick={resetGame} className="h-6 w-6 p-0" title="Reset game">
                        <RotateCcw className="size-3" />
                    </Button>
                </div>

                <div className="text-center">
                    <div className="text-muted-foreground text-sm">
                        Round {currentRound + 1} of {rounds}
                    </div>
                    <div className="text-muted-foreground text-xs">Wins: {wins}</div>
                </div>

                {gameState === 'flipping' && (
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <Loader2 className="size-16 animate-spin" />
                        </div>
                        <div className="text-muted-foreground text-sm">Flipping coin...</div>
                    </div>
                )}

                {gameState === 'result' && coinResult && (
                    <div className="text-center">
                        <div className="mb-4 flex justify-center perspective-midrange">
                            <motion.div
                                className={`aspect-square h-auto w-auto min-w-32 rounded-full border object-contain p-8 text-center transition-all`}
                                initial={{ scaleX: -1 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            >
                                <div className="scale-180 text-xl">{coinResult === 'heads' ? '👑' : '⭐'}</div>
                                <div className="mt-2 font-bold capitalize">{coinResult}</div>
                            </motion.div>
                        </div>

                        <div
                            className={`mb-4 rounded-md p-3 text-sm ${
                                playerChoice === coinResult
                                    ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                                    : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                            }`}
                        >
                            {playerChoice === coinResult ? '🎉 Correct!' : `❌ Wrong! You chose ${playerChoice}`}
                        </div>
                    </div>
                )}

                {gameState === 'setup' && !isGameComplete && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => startFlip('heads')}
                            className="hover:bg-primary/10 h-16 cursor-pointer rounded-lg text-lg font-medium"
                        >
                            👑 Heads
                        </button>
                        <button
                            onClick={() => startFlip('tails')}
                            className="hover:bg-primary/10 h-16 cursor-pointer rounded-lg text-lg font-medium"
                        >
                            ⭐ Tails
                        </button>
                    </div>
                )}

                {gameState === 'result' && currentRound + 1 < rounds && (
                    <Button onClick={nextRound} className="w-full rounded-2xl!">
                        Next Round ({currentRound + 1}/{rounds})
                    </Button>
                )}

                {gameState === 'result' && currentRound + 1 === rounds && (
                    <Button onClick={nextRound} className="w-full rounded-2xl!">
                        Finish Game
                    </Button>
                )}

                {isGameComplete && (
                    <div className="text-center">
                        <div className="mb-4 rounded-md bg-blue-50 p-4 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
                            <div className="mb-2 text-lg font-bold">Game Complete! 🎮</div>
                            <div className="text-sm">
                                You got {wins} out of {rounds} correct!
                                <br />({Math.round((wins / rounds) * 100)}% accuracy)
                            </div>
                        </div>
                        <Button onClick={resetGame} className="w-full rounded-2xl!">
                            Play Again
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export const coinFlipGameExtension = {
    type: 'tool' as const,
    name: 'coin-flip-game',
    prompt: 'use when you want to create a coin flip game. its a simple guessing game where the player predicts heads or tails, and the coin flips to show the result. play multiple rounds and track accuracy. initiate when the user agrees to play.',
    schema: coinFlipGameSchema,
    renderer: coinFlipGameRenderer,
} satisfies Extension<z.infer<typeof coinFlipGameSchema>>;
