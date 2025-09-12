# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple cyclic timer web application built with vanilla HTML, CSS, and JavaScript. The application is a single-page timer that allows users to set minutes and seconds, start a cyclic countdown, and receive audio/visual notifications when time expires.

## Architecture

**Single-file architecture**: The entire application is contained in `temporizador.html` - a self-contained HTML file with embedded CSS and JavaScript.

**Key components:**
- **UI Controls**: Input fields for minutes/seconds, start/stop buttons
- **Timer Display**: Large countdown display with visual effects
- **Timer Logic**: JavaScript-based countdown with automatic restart
- **Audio System**: Embedded base64 audio for timer notifications
- **Visual Effects**: CSS animations for notifications, pulse effects, and particle backgrounds
- **Responsive Design**: Mobile-first responsive layout with media queries

## File Structure

```
Temporizador Pomodoro/
├── temporizador.html    # Complete timer application
└── desktop.ini         # Windows folder configuration
```

## Development

**No build process**: This is a static HTML file that can be opened directly in a browser.

**Testing**: Open `temporizador.html` in any modern web browser to test functionality.

**Key Features:**
- Cyclic timer (automatically restarts after reaching zero)
- Keyboard shortcuts (Space to start/stop, Escape to stop)
- Audio notifications with visual fallbacks
- Responsive design for mobile and desktop
- Glass morphism UI design with animated backgrounds

## Code Patterns

**JavaScript Architecture:**
- Global state management with `isRunning`, `timerInterval`, `initialTime` variables
- Event-driven timer system using `setInterval`
- Error handling for audio playback with visual fallbacks
- Input validation and sanitization

**CSS Architecture:**
- CSS custom properties for consistent theming
- Keyframe animations for visual effects
- Glass morphism styling with backdrop-filter
- Mobile-first responsive design approach
- Accessibility considerations (prefers-reduced-motion, color scheme)

**Key Functions:**
- `startTimer()`: Initializes and starts the countdown
- `stopTimer()`: Stops and resets the timer
- `updateDisplay()`: Updates the time display
- `playSound()`: Handles audio notification with fallbacks
- `createSoundEffect()`: Creates visual notification effects