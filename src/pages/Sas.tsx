import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const Sas = () => {
  const [gameState, setGameState] = useState('waiting');
  const [choice, setChoice] = useState(null);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    let interval;
    if ((gameState === 'waiting' || gameState === 'opponentTurn') && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      if (gameState === 'waiting') {
        setGameState('choosing');
      } else if (gameState === 'opponentTurn') {
        setGameState('result');
        triggerConfetti();
      }
    }

    return () => clearInterval(interval);
  }, [gameState, timer]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2
        }
      });
    }, 250);
  };

  const handleChoice = (selectedChoice) => {
    setChoice(selectedChoice);
    setGameState('opponentTurn');
    setTimer(10);
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent"></div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        {/* Ambient background effects */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm p-8">
          {gameState === 'waiting' && (
            <div className="flex flex-col items-center space-y-6">
              <LoadingSpinner />
              <h2 className="text-2xl font-bold text-teal-400">
                Finding Opponent
              </h2>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(timer/10) * 100}%` }}
                ></div>
              </div>
              <p className="text-lg text-slate-400">Time remaining: {timer}s</p>
            </div>
          )}

          {gameState === 'choosing' && (
            <div className="flex flex-col items-center space-y-8">
              <h2 className="text-2xl font-bold text-teal-400">
                Make Your Choice
              </h2>
              <div className="flex space-x-8">
                <button
                  onClick={() => handleChoice('split')}
                  className="group relative flex flex-col items-center space-y-3 p-6 rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 hover:from-teal-900 hover:to-slate-800 transition-all duration-300 border border-slate-600 hover:border-teal-400"
                >
                  <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-teal-400 to-cyan-400 text-slate-900 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4-4m-4 4l4 4" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold text-teal-400 group-hover:text-teal-300">Split</span>
                </button>

                <button
                  onClick={() => handleChoice('steal')}
                  className="group relative flex flex-col items-center space-y-3 p-6 rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 hover:from-rose-900 hover:to-slate-800 transition-all duration-300 border border-slate-600 hover:border-rose-400"
                >
                  <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-rose-400 to-pink-400 text-slate-900 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold text-rose-400 group-hover:text-rose-300">Steal</span>
                </button>
              </div>
            </div>
          )}

          {gameState === 'opponentTurn' && (
            <div className="flex flex-col items-center space-y-6">
              <LoadingSpinner />
              <h2 className="text-2xl font-bold text-teal-400">
                Opponent's Turn
              </h2>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(timer/10) * 100}%` }}
                ></div>
              </div>
              <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                <p className="text-teal-400">Your choice: <span className="text-slate-300">{choice}</span></p>
              </div>
            </div>
          )}

          {gameState === 'result' && (
            <div className="flex flex-col items-center space-y-6">
              <h2 className="text-3xl font-bold text-teal-400 mb-4">
                Game Result
              </h2>
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-8 w-full border border-slate-600">
                <div className="text-center space-y-4">
                  <p className="text-xl text-slate-300">
                    You chose: <span className="text-teal-400 font-semibold">{choice}</span>
                  </p>
                  <p className="text-xl text-slate-300">
                    Opponent chose: <span className="text-rose-400 font-semibold">{choice === 'split' ? 'steal' : 'split'}</span>
                  </p>
                  <div className="mt-6 pt-6 border-t border-slate-600">
                    <p className="text-2xl font-bold">
                      {choice === 'split' ? (
                        <span className="text-rose-400">You lost 😢</span>
                      ) : (
                        <span className="text-teal-400">You won! 🎉</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setGameState('waiting');
                  setTimer(10);
                  setChoice(null);
                }}
                className="px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-900 rounded-xl hover:from-teal-300 hover:to-cyan-300 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sas;