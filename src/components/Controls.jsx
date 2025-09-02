import { motion, AnimatePresence } from 'framer-motion';

const Controls = ({ isVisible, onClose }) => {
  const controls = [
    {
      action: 'Jump',
      keys: ['SPACE', '↑', 'W'],
      description: 'Jump over obstacles',
      icon: '🦘'
    },
    {
      action: 'Duck',
      keys: ['↓', 'S'],
      description: 'Duck under obstacles (hold to stay down)',
      icon: '🐦'
    },
    {
      action: 'Pause',
      keys: ['P', 'ESC'],
      description: 'Pause/Resume the game',
      icon: '⏸️'
    },
    {
      action: 'Restart',
      keys: ['R'],
      description: 'Restart the game anytime',
      icon: '🔄'
    }
  ];

  const mobileControls = [
    {
      action: 'Jump',
      gesture: 'Tap Upper Half',
      description: 'Tap the upper half of the screen to jump',
      icon: '👆'
    },
    {
      action: 'Duck',
      gesture: 'Tap Lower Half',
      description: 'Tap and hold the lower half to duck',
      icon: '👇'
    }
  ];

  const tips = [
    '🎯 Time your jumps and ducks carefully!',
    '📈 Score increases over time and difficulty scales up',
    '💨 Game speed increases every 1000 points',
    '🏆 Your best score is saved automatically',
    '📱 Works great on mobile devices too!',
    '🎵 Enable sound for better experience'
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">🎮 How to Play</h2>
            <p className="text-blue-200">Master the controls and become an infinity chaser!</p>
          </motion.div>

          {/* Desktop Controls */}
          <div className="mb-6">
            <motion.h3
              className="text-xl font-bold text-white mb-4 flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              💻 Desktop Controls
            </motion.h3>
            <div className="grid gap-3">
              {controls.map((control, index) => (
                <motion.div
                  key={control.action}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{control.icon}</span>
                      <div>
                        <div className="text-white font-bold">{control.action}</div>
                        <div className="text-blue-200 text-sm">{control.description}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {control.keys.map((key, keyIndex) => (
                        <motion.span
                          key={keyIndex}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm font-mono font-bold shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {key}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="mb-6">
            <motion.h3
              className="text-xl font-bold text-white mb-4 flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              📱 Mobile Controls
            </motion.h3>
            <div className="grid gap-3">
              {mobileControls.map((control, index) => (
                <motion.div
                  key={control.action}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + 0.1 * index }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{control.icon}</span>
                      <div>
                        <div className="text-white font-bold">{control.action}</div>
                        <div className="text-blue-200 text-sm">{control.description}</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                      {control.gesture}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mb-6">
            <motion.h3
              className="text-xl font-bold text-white mb-4 flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              💡 Tips & Tricks
            </motion.h3>
            <div className="grid gap-2">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  className="text-blue-200 text-sm bg-white bg-opacity-5 rounded-lg p-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + 0.1 * index }}
                >
                  {tip}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Game Visual */}
          <motion.div
            className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-lg p-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-center text-white">
              <div className="text-lg font-bold mb-2">Game Elements</div>
              <div className="flex justify-around items-center text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-1">🏃‍♂️</div>
                  <div>Player</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🟥</div>
                  <div>Jump Over</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🟨</div>
                  <div>Duck Under</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">⚡</div>
                  <div>Speed Up!</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center">
            <motion.button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Got it! Let's Play! 🚀
            </motion.button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-3xl opacity-20">
            🎮
          </div>
          <div className="absolute bottom-4 left-4 text-2xl opacity-20">
            🏆
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Controls;
