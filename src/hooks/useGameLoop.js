
// Import React hooks for managing state, effects, and references
import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom React hook for creating a smooth, high-performance game loop
 * @param {boolean} isRunning - Whether the game loop should be active
 * @param {Function} onUpdate - Callback function called on each frame with deltaTime and FPS
 * @returns {number} Current FPS (frames per second)
 */
export const useGameLoop = (isRunning, onUpdate) => {
  // useRef to store values that persist between renders but don't trigger re-renders
  const animationFrameRef = useRef(); // Stores the current requestAnimationFrame ID
  const lastTimeRef = useRef(0);      // Stores timestamp of the previous frame
  const fpsRef = useRef(0);           // Current frames per second
  const frameCountRef = useRef(0);    // Frame counter for FPS calculation
  const lastFpsTimeRef = useRef(0);   // Last time FPS was calculated

  /**
   * The main game loop function - called every frame by requestAnimationFrame
   * useCallback ensures the function reference doesn't change unnecessarily
   */
  const gameLoop = useCallback((currentTime) => {
    // Exit early if game is not running (paused or stopped)
    if (!isRunning) return;

    // Calculate time elapsed since last frame (in milliseconds)
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime; // Update last frame timestamp

    // FPS Calculation: Count frames and calculate FPS every second
    frameCountRef.current++; // Increment frame counter
    
    // If 1 second (1000ms) has passed since last FPS calculation
    if (currentTime - lastFpsTimeRef.current >= 1000) {
      fpsRef.current = frameCountRef.current;  // Set FPS to frame count
      frameCountRef.current = 0;               // Reset frame counter
      lastFpsTimeRef.current = currentTime;    // Update FPS calculation timestamp
    }

    // Frame rate limiting: Only update if enough time has passed (60 FPS = 16.67ms per frame)
    // This prevents the game from running too fast on high-refresh displays
    if (deltaTime >= 16.67) {
      onUpdate(deltaTime, fpsRef.current); // Call the game update function
    }

    // Schedule the next frame - creates the continuous loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [isRunning, onUpdate]); // Dependencies: re-create if these change

  /**
   * useEffect manages the game loop lifecycle
   * Starts/stops the loop when isRunning changes, and cleans up on unmount
   */
  useEffect(() => {
    if (isRunning) {
      // Game is starting: initialize timestamp and start the loop
      lastTimeRef.current = performance.now(); // High-precision timestamp
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      // Game is stopping: cancel the current animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    // Cleanup function: ensures animation frame is cancelled when component unmounts
    // or when dependencies change, preventing memory leaks
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, gameLoop]); // Re-run effect when these dependencies change

  // Return current FPS so components can display it (useful for debugging)
  return fpsRef.current;
};

/**
 * GAME_CONFIG: Central configuration object for all game mechanics
 * Keeping all constants in one place makes the game easy to tune and balance
 */
export const GAME_CONFIG = {
  // Player physics constants
  PLAYER_JUMP_SPEED: 15,           // Initial upward velocity when jumping (pixels per frame)
  PLAYER_DUCK_DURATION: 500,       // How long duck animation lasts (milliseconds) 
  GRAVITY: 0.8,                    // Downward acceleration applied each frame (pixels/frame²)
  
  // Movement speeds
  GROUND_SPEED: 5,                 // Speed of scrolling ground texture (pixels per frame)
  OBSTACLE_SPEED: 5,               // Base speed of obstacles moving left (pixels per frame)
  
  // Game progression
  OBSTACLE_SPAWN_INTERVAL: 2000,   // Time between obstacle spawns (milliseconds)
  DIFFICULTY_INCREASE_INTERVAL: 10000, // How often difficulty increases (milliseconds)
  SCORE_INCREMENT: 1,              // Points gained per frame while running
  
  // Canvas and object dimensions (in pixels) - Made responsive
  CANVAS_WIDTH: 800,               // Desktop canvas width
  CANVAS_HEIGHT: 400,              // Desktop canvas height
  MOBILE_CANVAS_WIDTH: 350,        // Mobile canvas width
  MOBILE_CANVAS_HEIGHT: 300,       // Mobile canvas height
  PLAYER_WIDTH: 40,                // Player character width
  PLAYER_HEIGHT: 60,               // Player character height
  OBSTACLE_WIDTH: 30,              // Obstacle width
  OBSTACLE_HEIGHT: 60,             // Obstacle height
  
  // Player positioning
  PLAYER_X_DESKTOP: 100,           // Player X position on desktop
  PLAYER_X_MOBILE: 60,             // Player X position on mobile (more centered)
};

/**
 * Collision detection using Axis-Aligned Bounding Box (AABB) algorithm
 * Checks if two rectangles overlap in both X and Y dimensions
 * @param {Object} rect1 - First rectangle {x, y, width, height}
 * @param {Object} rect2 - Second rectangle {x, y, width, height}
 * @returns {boolean} True if rectangles are overlapping (collision detected)
 */
export const checkCollision = (rect1, rect2) => {
  // Check for overlap in both X and Y axes
  // For collision: rect1's left edge < rect2's right edge AND
  //               rect1's right edge > rect2's left edge AND
  //               rect1's top edge < rect2's bottom edge AND
  //               rect1's bottom edge > rect2's top edge
  return rect1.x < rect2.x + rect2.width &&         // rect1 left < rect2 right
         rect1.x + rect1.width > rect2.x &&         // rect1 right > rect2 left
         rect1.y < rect2.y + rect2.height &&        // rect1 top < rect2 bottom
         rect1.y + rect1.height > rect2.y;          // rect1 bottom > rect2 top
};

/**
 * Calculates difficulty multiplier based on current score
 * Game gets harder as player scores more points
 * @param {number} score - Current game score
 * @returns {number} Multiplier to apply to game speed (1.0 = normal, 1.2 = 20% faster, etc.)
 */
export const getDifficultyMultiplier = (score) => {
  // Every 1000 points increases difficulty by 20% (0.2)
  // Math.floor ensures we only increase at whole thousands
  // Formula: 1 + (thousands of points) * 0.2
  // Examples: score 0-999 = 1.0x, score 1000-1999 = 1.2x, score 2000-2999 = 1.4x
  return 1 + Math.floor(score / 1000) * 0.2;
};

/**
 * Generates procedural sound effects using Web Audio API
 * Creates simple synthetic sounds without requiring audio files
 * @param {string} soundType - Type of sound to play ('jump', 'collision', 'score')
 */
export const playSound = (soundType) => {
  try {
    // Use let for variable that will be reassigned in switch statement
    let audioFile;
    
    switch (soundType) {
      case 'jump':
        // Create a pleasant "beep" sound for jumping
        // Higher frequency (400Hz) sounds more upbeat and positive
        const jumpContext = new (window.AudioContext || window.webkitAudioContext)();
        const jumpOscillator = jumpContext.createOscillator();  // Sound generator
        const jumpGain = jumpContext.createGain();              // Volume controller
        
        // Connect audio nodes: Oscillator -> Gain -> Speakers
        jumpOscillator.connect(jumpGain);
        jumpGain.connect(jumpContext.destination);
        
        // Configure the sound: 400Hz frequency, low volume, quick fade-out
        jumpOscillator.frequency.setValueAtTime(400, jumpContext.currentTime);
        jumpGain.gain.setValueAtTime(0.1, jumpContext.currentTime); // Start at 10% volume
        jumpGain.gain.exponentialRampToValueAtTime(0.01, jumpContext.currentTime + 0.1); // Fade to 1% over 0.1s
        
        // Play the sound for 0.1 seconds
        jumpOscillator.start(jumpContext.currentTime);
        jumpOscillator.stop(jumpContext.currentTime + 0.1);
        break;
        
      case 'collision':
        // Create a harsh "crash" sound for collisions
        // Lower frequency (150Hz) sounds more ominous and negative
        const crashContext = new (window.AudioContext || window.webkitAudioContext)();
        const crashOscillator = crashContext.createOscillator();
        const crashGain = crashContext.createGain();
        
        crashOscillator.connect(crashGain);
        crashGain.connect(crashContext.destination);
        
        // Configure: Low frequency, louder volume, longer duration for impact
        crashOscillator.frequency.setValueAtTime(150, crashContext.currentTime);
        crashGain.gain.setValueAtTime(0.3, crashContext.currentTime); // 30% volume for impact
        crashGain.gain.exponentialRampToValueAtTime(0.01, crashContext.currentTime + 0.5); // Longer fade (0.5s)
        
        crashOscillator.start(crashContext.currentTime);
        crashOscillator.stop(crashContext.currentTime + 0.5);
        break;
        
      case 'score':
        // Create a rewarding "ding" sound for scoring points
        // High frequency (800Hz) sounds celebratory and positive
        const scoreContext = new (window.AudioContext || window.webkitAudioContext)();
        const scoreOscillator = scoreContext.createOscillator();
        const scoreGain = scoreContext.createGain();
        
        scoreOscillator.connect(scoreGain);
        scoreGain.connect(scoreContext.destination);
        
        // Configure: High frequency, moderate volume, quick and sharp
        scoreOscillator.frequency.setValueAtTime(800, scoreContext.currentTime);
        scoreGain.gain.setValueAtTime(0.1, scoreContext.currentTime);
        scoreGain.gain.exponentialRampToValueAtTime(0.01, scoreContext.currentTime + 0.1);
        
        scoreOscillator.start(scoreContext.currentTime);
        scoreOscillator.stop(scoreContext.currentTime + 0.1);
        break;
    }
  } catch (error) {
    // Gracefully handle browsers that don't support Web Audio API
    // or when user hasn't interacted with page yet (required for audio)
    console.log('Audio not supported or blocked');
  }
};