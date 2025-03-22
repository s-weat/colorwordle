"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, X } from "lucide-react";
import { toast } from "sonner";

function generateRandomColor() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

function calculateScore(guess: any, target: any) {
  const diff = Math.sqrt(
    Math.pow(guess.r - target.r, 2) +
    Math.pow(guess.g - target.g, 2) +
    Math.pow(guess.b - target.b, 2)
  );
  return Math.max(0, Math.floor(100 - (diff / 441.67) * 100)); // 441.67 is max possible difference
}

export default function Home() {
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [guessColor, setGuessColor] = useState({ r: 127, g: 127, b: 127 });
  const [attempts, setAttempts] = useState<Array<{ color: any; score: number }>>([]);
  const [gameWon, setGameWon] = useState(false);
  const maxAttempts = 6;

  const handleGuess = () => {
    const score = calculateScore(guessColor, targetColor);
    const newAttempt = { color: { ...guessColor }, score };
    setAttempts([...attempts, newAttempt]);

    if (score >= 98) {
      setGameWon(true);
      toast.success("Congratulations! You found the color! 🎨");
    } else if (attempts.length + 1 >= maxAttempts) {
      toast.error("Game Over! Try again!");
    } else {
      toast.info(`Score: ${score}%`);
    }
  };

  const resetGame = () => {
    setTargetColor(generateRandomColor());
    setGuessColor({ r: 127, g: 127, b: 127 });
    setAttempts([]);
    setGameWon(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Color Wordle</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium">Red</label>
              <Slider
                value={[guessColor.r]}
                min={0}
                max={255}
                step={1}
                onValueChange={(value) => setGuessColor({ ...guessColor, r: value[0] })}
                className="w-full"
              />
              
              <label className="block text-sm font-medium">Green</label>
              <Slider
                value={[guessColor.g]}
                min={0}
                max={255}
                step={1}
                onValueChange={(value) => setGuessColor({ ...guessColor, g: value[0] })}
                className="w-full"
              />
              
              <label className="block text-sm font-medium">Blue</label>
              <Slider
                value={[guessColor.b]}
                min={0}
                max={255}
                step={1}
                onValueChange={(value) => setGuessColor({ ...guessColor, b: value[0] })}
                className="w-full"
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleGuess}
                disabled={gameWon || attempts.length >= maxAttempts}
                className="w-full"
              >
                <Check className="w-4 h-4 mr-2" />
                Guess
              </Button>
              
              <Button
                onClick={resetGame}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
              <div className="h-1/2 w-full" style={{
                backgroundColor: gameWon
                  ? `rgb(${targetColor.r},${targetColor.g},${targetColor.b})`
                  : "???"
              }} />
              <div
                className="h-1/2 w-full"
                style={{
                  backgroundColor: `rgb(${guessColor.r},${guessColor.g},${guessColor.b})`
                }}
              />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Attempts: {attempts.length}/{maxAttempts}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {attempts.map((attempt, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-800"
            >
              <div
                className="w-12 h-12 rounded"
                style={{
                  backgroundColor: `rgb(${attempt.color.r},${attempt.color.g},${attempt.color.b})`
                }}
              />
              <div className="flex-1">
                <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-green-500"
                    style={{ width: `${attempt.score}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium">{attempt.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}