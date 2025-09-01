# 🏃‍♂️ InfinityChaser

An exciting endless runner game built with React, Vite, and Tailwind CSS. Jump and duck through obstacles as the game gets progressively more challenging!

![InfinityChaser Game](https://img.shields.io/badge/Game-InfinityChaser-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.12-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### ✨ Core Gameplay
- **Endless Running**: Infinite procedurally generated obstacles
- **Jump & Duck Mechanics**: Precise controls for avoiding obstacles
- **Progressive Difficulty**: Game speed increases as score grows
- **Real-time Scoring**: Points accumulate continuously with bonus for obstacle avoidance
- **Collision Detection**: Pixel-perfect collision system

### � Game Features  
- **Pause/Resume**: Press P or ESC to pause anytime
- **Restart**: Quick restart with R key or restart button
- **Best Score Tracking**: Automatically saved to localStorage
- **Sound Effects**: Audio feedback for jumps, collisions, and achievements
- **Responsive Design**: Works on desktop and mobile devices

### 📱 Mobile Optimized
- **Touch Controls**: Tap upper half to jump, lower half to duck
- **Responsive Layout**: Adapts to different screen sizes
- **Mobile-friendly UI**: Optimized buttons and spacing

### 🎨 UI/UX
- **Smooth Animations**: Powered by Framer Motion and GSAP
- **Modern Design**: Gradient backgrounds and glass-morphism effects
- **Visual Feedback**: Button hover effects and animations
- **Accessibility**: Keyboard navigation and screen reader support

## 🎮 Controls

### 🖥️ Desktop
| Action | Keys |
|--------|------|
| Jump | `SPACE`, `↑`, `W` |
| Duck | `↓`, `S` |
| Pause/Resume | `P`, `ESC` |
| Restart | `R` |
| Leaderboard | `L` |
| Help | `H` |

### 📱 Mobile
- **Jump**: Tap upper half of the screen
- **Duck**: Tap and hold lower half of the screen

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Quick Start
```bash
# Clone the repository
git clone https://github.com/AnshulParkar/infinityChaser.git
cd infinityChaser

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🏗️ Tech Stack

### Core Technologies
- **React 19.1.1**: Component-based UI framework
- **Vite 7.1.2**: Fast build tool and dev server
- **Tailwind CSS 4.1.12**: Utility-first CSS framework

### Animation Libraries
- **Framer Motion**: React animation library
- **GSAP**: High-performance animations

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Vite Plugin React**: React support for Vite

## 📂 Project Structure

```
infinityChaser/
├── public/
│   └── assets/             # Game assets (images, sounds)
├── src/
│   ├── components/
│   │   ├── GameCanvas.jsx  # Main game logic and rendering
│   │   ├── HUD.jsx         # Score display and controls
│   │   ├── Leaderboard.jsx # Score leaderboard
│   │   └── Controls.jsx    # Help and instructions
│   ├── hooks/
│   │   └── useGameLoop.js  # Game loop and physics
│   ├── data/
│   │   └── leaderboard.json# Mock leaderboard data
│   ├── styles/
│   │   └── globals.css     # Custom CSS animations
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── package.json
└── README.md
```

## 🎯 Game Mechanics

### Scoring System
- **Base Score**: +1 point per frame while running
- **Obstacle Bonus**: +10 points per obstacle cleared
- **Milestone Rewards**: Special notifications every 500 points
- **Difficulty Scaling**: Speed increases every 1000 points

### Obstacles
- **Red Obstacles**: High obstacles - requires jumping
- **Yellow Obstacles**: Low obstacles - requires ducking
- **Dynamic Spawning**: Random obstacle generation
- **Increasing Speed**: Obstacles move faster as difficulty increases

### Physics
- **Jump Mechanics**: Realistic gravity and velocity
- **Duck System**: Temporary height reduction
- **Collision Detection**: Precise bounding box collision
- **Smooth Movement**: 60fps game loop with delta time

## � Leaderboard

The game includes a mock leaderboard system that:
- Shows top 10 scores
- Displays current session score
- Saves best score locally
- Shows player ranking
- Includes achievement celebrations

## 🎨 Customization

### Adding New Obstacles
```javascript
// In GameCanvas.jsx - spawnObstacle function
const obstacleTypes = ['high', 'low', 'moving']; // Add new types
```

### Modifying Game Speed
```javascript
// In useGameLoop.js - GAME_CONFIG
OBSTACLE_SPEED: 5,        // Base speed
DIFFICULTY_INCREASE_INTERVAL: 10000, // Speed increase interval
```

### Custom Animations
```css
/* In src/styles/globals.css */
@keyframes customAnimation {
  /* Your animation keyframes */
}
```

## 🐛 Known Issues

### Current Limitations
- Sound requires user interaction to play (browser policy)
- Canvas size fixed for optimal gameplay
- Limited obstacle variety (planned for future updates)

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+  
- ✅ Safari 14+
- ✅ Edge 90+

## 🚧 Future Enhancements

### Planned Features
- [ ] Power-ups and special abilities
- [ ] Multiple character skins
- [ ] Online leaderboards
- [ ] More obstacle types
- [ ] Background music
- [ ] Achievement system
- [ ] Daily challenges

### Performance Optimizations
- [ ] Sprite sheet implementation
- [ ] Object pooling for obstacles
- [ ] Web Workers for physics calculations
- [ ] PWA support for offline play

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use Tailwind CSS for styling
- Maintain consistent code formatting
- Add comments for complex logic
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Acknowledgments

- **React Team**: For the amazing React framework
- **Vite Team**: For the lightning-fast build tool
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations
- **Open Source Community**: For inspiration and resources

## � Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/AnshulParkar/infinityChaser/issues) page
2. Create a new issue with detailed description
3. Join our community discussions

---

<div align="center">
  
**Made with ❤️ by [Anshul Parkar](https://github.com/AnshulParkar)**

⭐ Star this repo if you enjoyed the game!

[Play Game](https://infinitychaser.vercel.app) • [Report Bug](https://github.com/AnshulParkar/infinityChaser/issues) • [Request Feature](https://github.com/AnshulParkar/infinityChaser/issues)

</div>
- 📊 Leaderboard (mock JSON for now)
- ✨ Smooth animations & subtle effects

## 🛠️ Tech Stack
- React.js (Vite or CRA)
- Tailwind CSS
- Framer Motion or GSAP
- LocalStorage API

## 🎮 Controls
- `Space` or `Tap` - Jump
- `Down Arrow` or `Swipe Down` - Duck
- `P` - Pause/Resume

## 🏗️ Setup
```bash
# Clone the repo
git clone https://github.com/yourusername/infinitychaser.git
cd infinitychaser

# Install dependencies
npm install

# Run the app
npm run dev
