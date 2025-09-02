import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import leaderboardData from '../data/leaderboard.json';

const Leaderboard = ({ currentScore, isVisible, onClose }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    // Combine static leaderboard with current score
    let combinedData = [...leaderboardData];
    
    if (currentScore > 0) {
      const userEntry = {
        id: 'current',
        name: 'You',
        score: currentScore,
        date: new Date().toISOString().split('T')[0],
        isCurrent: true
      };
      
      combinedData.push(userEntry);
      combinedData.sort((a, b) => b.score - a.score);
      
      // Find user's rank
      const rank = combinedData.findIndex(entry => entry.id === 'current') + 1;
      setUserRank(rank);
    }
    
    setLeaderboard(combinedData.slice(0, 10)); // Top 10
  }, [currentScore]);

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
          className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.h2
              className="text-3xl font-bold text-white mb-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              🏆 Leaderboard
            </motion.h2>
            {userRank && (
              <motion.p
                className="text-yellow-300 text-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                Your Rank: {getRankEmoji(userRank)}
              </motion.p>
            )}
          </div>

          {/* Leaderboard List */}
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  entry.isCurrent
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black shadow-lg'
                    : 'bg-white bg-opacity-10 backdrop-blur-sm text-black hover:bg-opacity-20'
                } transition-all duration-200`}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold min-w-[3rem]">
                    {getRankEmoji(index + 1)}
                  </div>
                  <div>
                    <div className={`font-bold ${entry.isCurrent ? 'text-yellow-100' : 'text-black'}`}>
                      {entry.name}
                      {entry.isCurrent && (
                        <motion.span
                          className="ml-2 text-sm"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ← New!
                        </motion.span>
                      )}
                    </div>
                    <div className={`text-sm ${entry.isCurrent ? 'text-yellow-200' : 'text-gray-300'}`}>
                      {formatDate(entry.date)}
                    </div>
                  </div>
                </div>
                <div className={`text-xl font-mono font-bold ${entry.isCurrent ? 'text-yellow-100' : 'text-white'}`}>
                  {entry.score.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <motion.button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
            
            <motion.p
              className="text-gray-300 text-sm mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Keep playing to climb the ranks! 🚀
            </motion.p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-4xl opacity-20">
            🏃‍♂️
          </div>
          <div className="absolute bottom-4 left-4 text-3xl opacity-20">
            ⚡
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Leaderboard;