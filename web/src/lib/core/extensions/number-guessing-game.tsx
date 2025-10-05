import { z } from 'zod';
import { Extension } from '../types/extensions';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RotateCcw, Gamepad2, Trophy } from 'lucide-react';

const numberGuessingGameSchema = z.object({
    difficulty: z.enum(['easy', 'medium', 'hard']).default('easy'),
});

type GameState = 'menu' | 'playing' | 'won' | 'lost';

const numberGuessingGameRenderer = ({
    difficulty = 'easy',
    onInteract,
}: Partial<z.infer<typeof numberGuessingGameSchema>> & {
    onInteract: (interaction: string, props: unknown[]) => void;
}) => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [targetNumber, setTargetNumber] = useState<number>(0);
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string>('');
    const [maxAttempts] = useState(7);

    // Get number range based on difficulty
    const getNumberRange = () => {
        switch (difficulty) {
            case 'easy':
                return { min: 1, max: 10, label: '1-10' };
            case 'medium':
                return { min: 1, max: 50, label: '1-50' };
            case 'hard':
                return { min: 1, max: 100, label: '1-100' };
        }
    };

    const startGame = () => {
        const range = getNumberRange();
        const newTarget = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        setTargetNumber(newTarget);
        setAttempts(0);
        setCurrentGuess('');
        setFeedback('');
        setGameState('playing');
    };

    const makeGuess = () => {
        const guess = parseInt(currentGuess);
        if (isNaN(guess)) {
            setFeedback('Please enter a valid number');
            return;
        }

        const range = getNumberRange();
        if (guess < range.min || guess > range.max) {
            setFeedback(`Please enter a number between ${range.min} and ${range.max}`);
            return;
        }

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (guess === targetNumber) {
            setGameState('won');
            setFeedback(`🎉 Correct! You found it in ${newAttempts} attempts!`);
            if (onInteract) onInteract('guessing-game-ended', ['won', newAttempts]);
        } else if (newAttempts >= maxAttempts) {
            setGameState('lost');
            setFeedback(`😅 Game Over! The number was ${targetNumber}. Better luck next time!`);
            if (onInteract) onInteract('guessing-game-ended', ['lost', targetNumber]);
        } else {
            const hint = guess < targetNumber ? 'Too low! 📈' : 'Too high! 📉';
            setFeedback(`${hint} Try again. (${newAttempts}/${maxAttempts} attempts)`);
        }

        setCurrentGuess('');
    };

    const resetGame = () => {
        setGameState('menu');
        setAttempts(0);
        setCurrentGuess('');
        setFeedback('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && gameState === 'playing') {
            makeGuess();
        }
    };

    if (gameState === 'menu') {
        return (
            <Card>
                <div className="space-y-4 p-4">
                    <Label>
                        <Gamepad2 className="size-4" /> Number Guessing Game
                    </Label>
                    <div className="text-muted-foreground text-sm">
                        Guess the secret number between {getNumberRange().label}. You have {maxAttempts} attempts.
                        Difficulty: {difficulty}.
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
                        <Gamepad2 className="size-4" /> Number Guessing Game
                    </Label>
                    <Button variant="outline" size="sm" onClick={resetGame} className="h-6 w-6 p-0" title="Reset game">
                        <RotateCcw className="size-3" />
                    </Button>
                </div>

                <div className="text-center">
                    <div className="text-muted-foreground mb-2 text-sm">
                        Guess a number between {getNumberRange().label}
                    </div>
                    <div className="text-muted-foreground text-xs">
                        Attempts: {attempts}/{maxAttempts}
                    </div>
                </div>

                {feedback && (
                    <div
                        className={`rounded-md p-3 text-center text-sm ${
                            gameState === 'won'
                                ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                                : gameState === 'lost'
                                  ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                                  : 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                        }`}
                    >
                        {feedback}
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder={`Enter number (${getNumberRange().min}-${getNumberRange().max})`}
                            value={currentGuess}
                            onChange={(e) => setCurrentGuess(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="text-center"
                            min={getNumberRange().min}
                            max={getNumberRange().max}
                        />
                        <Button onClick={makeGuess} disabled={!currentGuess.trim()}>
                            Guess
                        </Button>
                    </div>
                )}

                {gameState === 'won' && (
                    <div className="flex justify-center">
                        <Trophy className="size-8 text-yellow-500" />
                    </div>
                )}
            </div>
        </Card>
    );
};

export const numberGuessingGameExtension = {
    name: 'number-guessing-game',
    type: 'tool',
    prompt: 'use when you want to create a number guessing game. its a simple game where the player has to guess a secret number between 1-10 (easy), 1-50 (medium), or 1-100 (hard). they have 7 attempts and get feedback if their guess is too high or too low. initiate when the user agrees to play.',
    schema: numberGuessingGameSchema,
    renderer: numberGuessingGameRenderer,
} satisfies Extension<z.infer<typeof numberGuessingGameSchema>>;
