import { z } from 'zod';
import { Extension } from '../types/extensions';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RotateCcw, Gamepad2 } from 'lucide-react';

const clickerGameSchema = z.object({
    duration: z.number().default(10), // seconds
    difficulty: z.enum(['easy', 'medium', 'hard']).default('hard'),
});

type GameState = 'menu' | 'playing' | 'ended';

const clickerGameRenderer = ({
    duration = 10,
    difficulty = 'hard',
    onInteract,
}: Partial<z.infer<typeof clickerGameSchema>> & {
    onInteract: (interaction: string, props: unknown[]) => void;
}) => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [playerClicks, setPlayerClicks] = useState(0);
    const [aiClicks, setAiClicks] = useState(0);
    const [timeLeft, setTimeLeft] = useState(duration);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startGame = () => {
        setPlayerClicks(0);
        setAiClicks(0);
        setTimeLeft(duration);
        setGameState('playing');

        // Start AI clicking
        intervalRef.current = setInterval(
            () => {
                setAiClicks((prev) => prev + 1);
            },
            difficulty === 'easy' ? 200 : difficulty === 'medium' ? 200 : 150,
        ); // AI clicks every 200ms
    };

    const handlePlayerClick = () => {
        if (gameState === 'playing') {
            setPlayerClicks((prev) => prev + 1);
        }
    };

    const resetGame = () => {
        setGameState('menu');
        setPlayerClicks(0);
        setAiClicks(0);
        setTimeLeft(duration);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Timer effect
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gameState === 'playing' && timeLeft === 0) {
            setGameState('ended');
            if (onInteract)
                onInteract('clicker-game-ended', [
                    playerClicks > aiClicks ? 'player' : aiClicks > playerClicks ? 'ai' : 'tie',
                ]);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [gameState, timeLeft]);

    if (gameState === 'menu') {
        return (
            <Card>
                <div className="space-y-4 p-4">
                    <Label>
                        <Gamepad2 className="size-4" /> Clicker Battle
                    </Label>
                    <div className="text-muted-foreground text-sm">
                        Player vs AI clicking battle. Duration: {duration}s. Difficulty: {difficulty}.
                    </div>
                    <Button onClick={startGame} className="w-full rounded-2xl!">
                        Start Game
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <Label>
                        <Gamepad2 className="size-4" /> Clicker Battle
                    </Label>
                    <Button variant="outline" size="sm" onClick={resetGame} className="h-6 w-6 p-0" title="Reset game">
                        <RotateCcw className="size-3" />
                    </Button>
                </div>

                {gameState === 'ended' && (
                    <div className="bg-muted rounded-md p-3 text-center">
                        <div className="mb-2 text-sm font-medium">
                            {playerClicks > aiClicks
                                ? '🎉 You Win!'
                                : aiClicks > playerClicks
                                  ? '🤖 AI Wins!'
                                  : '🤝 Tie!'}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <div className="font-medium text-blue-600">Your Clicks</div>
                                <div className="text-lg font-bold">{playerClicks}</div>
                            </div>
                            <div>
                                <div className="font-medium text-red-600">AI Clicks</div>
                                <div className="text-lg font-bold">{aiClicks}</div>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'playing' && (
                    <>
                        <div className="text-center">
                            <div className="text-primary mb-1 text-2xl font-bold">{timeLeft}s</div>
                            <div className="text-muted-foreground text-xs">Time Left</div>
                        </div>

                        <div className="flex items-center justify-evenly gap-3">
                            <div className="aspect-square h-fit rounded-full bg-blue-50 p-6 text-center dark:bg-blue-950/20">
                                <div className="mb-1 text-xs font-medium text-blue-600">You</div>
                                <div className="text-lg font-bold">{playerClicks}</div>
                            </div>
                            <div className="aspect-square rounded-full bg-red-50 p-6 text-center dark:bg-red-950/20">
                                <div className="mb-1 text-xs font-medium text-red-600">AI</div>
                                <div className="text-lg font-bold">{aiClicks}</div>
                            </div>
                        </div>
                    </>
                )}

                <Button
                    onClick={handlePlayerClick}
                    disabled={gameState !== 'playing'}
                    className="h-12 w-full rounded-2xl! text-base font-medium"
                >
                    {gameState === 'playing' ? 'CLICK!' : 'Game Over'}
                </Button>
            </div>
        </Card>
    );
};

export const clickerGameExtension = {
    type: 'tool' as const,
    name: 'clicker-game',
    prompt: 'use when you want to create a clicker game. its a mini-game where the player and the ai have to click as fast as they can and the one with the most clicks wins it should be fun and engaging, initiate when the user agrees to play. do 10 seconds by default',
    schema: clickerGameSchema,
    renderer: clickerGameRenderer,
} satisfies Extension<z.infer<typeof clickerGameSchema>>;
