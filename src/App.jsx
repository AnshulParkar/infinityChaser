import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import Leaderboard from './components/LeaderBoard';
import Controls from './components/Controls';
import './styles/globals.css';

function App() {
  // Game state
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver'
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [restartTrigger, setRestartTrigger] = useState(0);

  // Load best score from localStorage on mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem('infinityChaser-bestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Save best score when it changes
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('infinityChaser-bestScore', score.toString());
    }
  }, [score, bestScore]);

  // Game event handlers
  const handleGameStart = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setRestartTrigger(prev => prev + 1);
  }, []);

  const handleGameOver = useCallback((finalScore) => {
    setGameState('gameOver');
    setScore(finalScore);
  }, []);

  const handleScoreUpdate = useCallback((newScore) => {
    setScore(newScore);
  }, []);

  const handlePause = useCallback(() => {
    setGameState('paused');
  }, []);

  const handleResume = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setRestartTrigger(prev => prev + 1);
  }, []);

  const handleMenuReturn = useCallback(() => {
    setGameState('menu');
    setScore(0);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyP':
          if (gameState === 'playing') {
            handlePause();
          } else if (gameState === 'paused') {
            handleResume();
          }
          break;
        case 'Escape':
          if (gameState === 'playing') {
            handlePause();
          } else if (gameState === 'paused') {
            handleResume();
          } else if (showLeaderboard) {
            setShowLeaderboard(false);
          } else if (showControls) {
            setShowControls(false);
          }
          break;
        case 'KeyR':
          if (gameState === 'playing' || gameState === 'paused' || gameState === 'gameOver') {
            handleRestart();
          }
          break;
        case 'KeyL':
          if (gameState === 'menu' || gameState === 'gameOver') {
            setShowLeaderboard(true);
          }
          break;
        case 'KeyH':
          if (gameState === 'menu') {
            setShowControls(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, showLeaderboard, showControls, handlePause, handleResume, handleRestart]);

  const isGameRunning = gameState === 'playing' || gameState === 'paused';
  const isPaused = gameState === 'paused';

  return (
    <div className="game-container min-h-screen flex flex-col">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-white bg-opacity-5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center text-white mb-2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          InfinityChaser
        </motion.h1>
        <motion.p
          className="text-center text-blue-200 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          The Ultimate Endless Runner Experience
        </motion.p>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        
        {/* HUD */}
        {isGameRunning && (
          <HUD
            score={score}
            bestScore={bestScore}
            isGameRunning={isGameRunning}
            isPaused={isPaused}
            onPause={handlePause}
            onResume={handleResume}
            onRestart={handleRestart}
            gameState={gameState}
          />
        )}

        {/* Game Canvas */}
        <div className="canvas-container mb-8 px-4 w-half flex justify-center">
          <GameCanvas
            onScoreUpdate={handleScoreUpdate}
            onGameOver={handleGameOver}
            onGameStart={handleGameStart}
            isGameRunning={isGameRunning}
            isPaused={isPaused}
            onRestart={restartTrigger}
          />
        </div>

        {/* Menu/Game Over Screen */}
        <AnimatePresence>
          {(gameState === 'menu' || gameState === 'gameOver') && (
            <motion.div
              className="text-center mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
            >
              {gameState === 'gameOver' && (
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <h2 className="text-4xl font-bold text-red-400 mb-2">Game Over!</h2>
                  <p className="text-2xl text-white">Final Score: {score.toLocaleString()}</p>
                  {score === bestScore && score > 0 && (
                    <motion.p
                      className="text-yellow-400 text-lg font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      🎉 New Best Score! 🎉
                    </motion.p>
                  )}
                </motion.div>
              )}

              <div className="flex flex-wrap justify-center gap-4">
                {gameState === 'menu' ? (
                  <motion.button
                    onClick={handleGameStart}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 btn-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🚀 START GAME
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleRestart}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 btn-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔄 PLAY AGAIN
                  </motion.button>
                )}

                <motion.button
                  onClick={() => setShowLeaderboard(true)}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg shadow-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 btn-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🏆 LEADERBOARD
                </motion.button>

                <motion.button
                  onClick={() => setShowControls(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 btn-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎮 HOW TO PLAY
                </motion.button>
              </div>

              {gameState === 'gameOver' && (
                <motion.button
                  onClick={handleMenuReturn}
                  className="mt-4 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  ← BACK TO MENU
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center p-4 text-blue-200 text-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Best Score: {bestScore.toLocaleString()} | Made by Anshul Parkar</p>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            <span>Keyboard: P (Pause) • R (Restart) • L (Leaderboard) • H (Help)</span>
          </div>
        </motion.div>
      </footer>

      {/* Modals */}
      <Leaderboard
        currentScore={score}
        isVisible={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />

      <Controls
        isVisible={showControls}
        onClose={() => setShowControls(false)}
      />
    </div>
  );
}

export default App;
