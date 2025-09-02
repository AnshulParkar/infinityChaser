import { motion } from 'framer-motion';

const HUD = ({ 
  score, 
  bestScore, 
  isGameRunning, 
  isPaused, 
  onPause, 
  onResume, 
  onRestart,
  gameState 
}) => {
  const formatScore = (score) => {
    return score.toString().padStart(6, '0');
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top HUD - Scores */}
      <div className="flex justify-between items-center mb-4">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="text-sm opacity-80">SCORE</div>
          <div className="text-2xl font-bold font-mono">
            {formatScore(score)}
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="text-sm opacity-80">BEST</div>
          <div className="text-2xl font-bold font-mono">
            {formatScore(bestScore)}
          </div>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        {isGameRunning && (
          <motion.button
            onClick={isPaused ? onResume : onPause}
            className={`px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-200 ${
              isPaused
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
          </motion.button>
        )}

        <motion.button
          onClick={onRestart}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 RESTART
        </motion.button>
      </div>

      {/* Game State Indicators */}
      {isGameRunning && (
        <div className="flex justify-center gap-6 text-sm">
          <motion.div
            className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg text-gray-700"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="font-semibold">Difficulty:</span> {(1 + Math.floor(score / 1000) * 0.2).toFixed(1)}x
          </motion.div>
          
          {gameState === 'playing' && (
            <motion.div
              className="bg-green-100 bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg text-green-700"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏃‍♂️ Running
            </motion.div>
          )}

          {gameState === 'paused' && (
            <motion.div
              className="bg-yellow-100 bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg text-yellow-700"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⏸️ Paused
            </motion.div>
          )}

          {gameState === 'gameOver' && (
            <motion.div
              className="bg-red-100 bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg text-red-700"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              💥 Game Over
            </motion.div>
          )}
        </div>
      )}

      {/* Achievement notifications */}
      {score > 0 && score % 500 === 0 && isGameRunning && (
        <motion.div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg shadow-2xl z-50"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: [0, 1.2, 1], rotate: [0, 5, 0] }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold">🎉 MILESTONE!</div>
            <div className="text-lg">{score} Points!</div>
          </div>
        </motion.div>
      )}

      {/* Mobile-friendly score display */}
      <div className="md:hidden fixed top-4 left-4 right-4 flex justify-between z-40">
        <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          Score: {formatScore(score)}
        </div>
        <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          Best: {formatScore(bestScore)}
        </div>
      </div>
    </motion.div>
  );
};

export default HUD;