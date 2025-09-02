import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameLoop, GAME_CONFIG, checkCollision, getDifficultyMultiplier, playSound } from '../hooks/useGameLoop';

const GameCanvas = ({ 
  onScoreUpdate, 
  onGameOver, 
  onGameStart, 
  isGameRunning, 
  isPaused,
  onRestart 
}) => {
  // Game state refs (using refs to avoid re-renders)
  const playerRef = useRef({
    x: 100,
    y: GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PLAYER_HEIGHT - 50,
    width: GAME_CONFIG.PLAYER_WIDTH,
    height: GAME_CONFIG.PLAYER_HEIGHT,
    velocityY: 0,
    isJumping: false,
    isDucking: false,
    groundY: GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PLAYER_HEIGHT - 50
  });

  const obstaclesRef = useRef([]);
  const gameStateRef = useRef({
    score: 0,
    lastObstacleSpawn: 0,
    groundOffset: 0,
    difficultyMultiplier: 1,
    lastDifficultyIncrease: 0
  });

  // React state for UI updates
  const [playerState, setPlayerState] = useState({
    isJumping: false,
    isDucking: false,
    y: playerRef.current.y
  });

  const canvasRef = useRef(null);
  const keysRef = useRef({ jump: false, duck: false });

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGameRunning || isPaused) return;
      
      switch (e.code) {
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          if (!playerRef.current.isJumping && !playerRef.current.isDucking) {
            jump();
          }
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          if (!playerRef.current.isJumping) {
            duck();
          }
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'ArrowDown':
        case 'KeyS':
          if (playerRef.current.isDucking) {
            standUp();
          }
          break;
      }
    };

    // Mobile touch handling
    const handleTouchStart = (e) => {
      if (!isGameRunning || isPaused) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const touchY = touch.clientY - rect.top;
      const canvasHeight = rect.height;
      
      if (touchY < canvasHeight / 2) {
        // Touch upper half - jump
        if (!playerRef.current.isJumping && !playerRef.current.isDucking) {
          jump();
        }
      } else {
        // Touch lower half - duck
        if (!playerRef.current.isJumping) {
          duck();
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (playerRef.current.isDucking) {
        standUp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    if (canvasRef.current) {
      canvasRef.current.addEventListener('touchstart', handleTouchStart);
      canvasRef.current.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('touchstart', handleTouchStart);
        canvasRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isGameRunning, isPaused]);

  const jump = () => {
    playerRef.current.velocityY = -GAME_CONFIG.PLAYER_JUMP_SPEED;
    playerRef.current.isJumping = true;
    setPlayerState(prev => ({ ...prev, isJumping: true }));
    playSound('jump');
  };

  const duck = () => {
    playerRef.current.isDucking = true;
    playerRef.current.height = GAME_CONFIG.PLAYER_HEIGHT * 0.5;
    playerRef.current.y = playerRef.current.groundY + GAME_CONFIG.PLAYER_HEIGHT * 0.5;
    setPlayerState(prev => ({ ...prev, isDucking: true }));
  };

  const standUp = () => {
    playerRef.current.isDucking = false;
    playerRef.current.height = GAME_CONFIG.PLAYER_HEIGHT;
    playerRef.current.y = playerRef.current.groundY;
    setPlayerState(prev => ({ ...prev, isDucking: false }));
  };

  const spawnObstacle = (currentTime) => {
    const timeSinceLastSpawn = currentTime - gameStateRef.current.lastObstacleSpawn;
    const spawnInterval = GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL / gameStateRef.current.difficultyMultiplier;
    
    if (timeSinceLastSpawn > spawnInterval) {
      const obstacleType = Math.random() > 0.5 ? 'high' : 'low';
      const obstacle = {
        id: Date.now(),
        x: GAME_CONFIG.CANVAS_WIDTH,
        y: obstacleType === 'high' 
          ? GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.OBSTACLE_HEIGHT - 50
          : GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.OBSTACLE_HEIGHT - 100,
        width: GAME_CONFIG.OBSTACLE_WIDTH,
        height: GAME_CONFIG.OBSTACLE_HEIGHT,
        type: obstacleType
      };
      
      obstaclesRef.current.push(obstacle);
      gameStateRef.current.lastObstacleSpawn = currentTime;
    }
  };

  const updateGame = useCallback((deltaTime, fps) => {
    const currentTime = performance.now();
    
    // Update difficulty
    if (currentTime - gameStateRef.current.lastDifficultyIncrease > GAME_CONFIG.DIFFICULTY_INCREASE_INTERVAL) {
      gameStateRef.current.difficultyMultiplier = getDifficultyMultiplier(gameStateRef.current.score);
      gameStateRef.current.lastDifficultyIncrease = currentTime;
    }

    // Update player physics
    if (playerRef.current.isJumping) {
      playerRef.current.velocityY += GAME_CONFIG.GRAVITY;
      playerRef.current.y += playerRef.current.velocityY;
      
      if (playerRef.current.y >= playerRef.current.groundY) {
        playerRef.current.y = playerRef.current.groundY;
        playerRef.current.velocityY = 0;
        playerRef.current.isJumping = false;
        setPlayerState(prev => ({ ...prev, isJumping: false }));
      }
      
      setPlayerState(prev => ({ ...prev, y: playerRef.current.y }));
    }

    // Spawn obstacles
    spawnObstacle(currentTime);

    // Update obstacles
    const speed = GAME_CONFIG.OBSTACLE_SPEED * gameStateRef.current.difficultyMultiplier;
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
      obstacle.x -= speed;
      
      // Remove obstacles that are off-screen
      if (obstacle.x + obstacle.width < 0) {
        gameStateRef.current.score += GAME_CONFIG.SCORE_INCREMENT * 10;
        onScoreUpdate(gameStateRef.current.score);
        if (gameStateRef.current.score % 100 === 0) {
          playSound('score');
        }
        return false;
      }
      
      // Check collision
      if (checkCollision(playerRef.current, obstacle)) {
        playSound('collision');
        onGameOver(gameStateRef.current.score);
        return false;
      }
      
      return true;
    });

    // Update ground animation
    gameStateRef.current.groundOffset -= GAME_CONFIG.GROUND_SPEED * gameStateRef.current.difficultyMultiplier;
    if (gameStateRef.current.groundOffset <= -50) {
      gameStateRef.current.groundOffset = 0;
    }

    // Increment score continuously
    gameStateRef.current.score += GAME_CONFIG.SCORE_INCREMENT;
    onScoreUpdate(gameStateRef.current.score);

    // Draw everything
    draw();
  }, [onScoreUpdate, onGameOver]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw animated background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw moving ground
    ctx.fillStyle = '#8B4513';
    for (let i = gameStateRef.current.groundOffset; i < canvas.width + 50; i += 50) {
      ctx.fillRect(i, canvas.height - 50, 50, 50);
    }

    // Draw player
    ctx.fillStyle = playerRef.current.isDucking ? '#FF6B6B' : '#4ECDC4';
    ctx.fillRect(
      playerRef.current.x, 
      playerRef.current.y, 
      playerRef.current.width, 
      playerRef.current.height
    );

    // Draw player eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(playerRef.current.x + 8, playerRef.current.y + 8, 6, 6);
    ctx.fillRect(playerRef.current.x + 20, playerRef.current.y + 8, 6, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(playerRef.current.x + 10, playerRef.current.y + 10, 2, 2);
    ctx.fillRect(playerRef.current.x + 22, playerRef.current.y + 10, 2, 2);

    // Draw obstacles
    obstaclesRef.current.forEach(obstacle => {
      ctx.fillStyle = obstacle.type === 'high' ? '#E74C3C' : '#F39C12';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  };

  // Initialize/reset game
  const resetGame = () => {
    playerRef.current = {
      x: 100,
      y: GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PLAYER_HEIGHT - 50,
      width: GAME_CONFIG.PLAYER_WIDTH,
      height: GAME_CONFIG.PLAYER_HEIGHT,
      velocityY: 0,
      isJumping: false,
      isDucking: false,
      groundY: GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PLAYER_HEIGHT - 50
    };
    
    obstaclesRef.current = [];
    gameStateRef.current = {
      score: 0,
      lastObstacleSpawn: 0,
      groundOffset: 0,
      difficultyMultiplier: 1,
      lastDifficultyIncrease: 0
    };
    
    setPlayerState({
      isJumping: false,
      isDucking: false,
      y: playerRef.current.y
    });
  };

  useEffect(() => {
    if (onRestart) {
      resetGame();
    }
  }, [onRestart]);

  // Use the game loop
  const fps = useGameLoop(isGameRunning && !isPaused, updateGame);

  return (
    <div className="flex flex-col items-center">
      <motion.canvas
        ref={canvasRef}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        className="border-4 border-gray-800 rounded-lg shadow-2xl bg-gradient-to-b from-blue-200 to-green-200"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ touchAction: 'none' }}
      />
      
      {/* Game instructions overlay */}
      {!isGameRunning && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">InfinityChaser</h2>
            <p className="text-lg mb-2">Press SPACE or ↑ to JUMP</p>
            <p className="text-lg mb-4">Press ↓ or S to DUCK</p>
            <p className="text-sm mb-4">On mobile: Tap upper half to jump, lower half to duck</p>
            <button
              onClick={onGameStart}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-200"
            >
              START GAME
            </button>
          </div>
        </motion.div>
      )}

      {/* Pause overlay */}
      {isPaused && isGameRunning && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">PAUSED</h2>
            <p className="text-lg">Game is paused</p>
          </div>
        </motion.div>
      )}

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          FPS: {fps} | Obstacles: {obstaclesRef.current.length} | 
          Difficulty: {gameStateRef.current.difficultyMultiplier.toFixed(1)}x
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
