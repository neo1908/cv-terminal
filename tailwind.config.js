/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Consolas', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#0a0a0a',      // Deep black background
          surface: '#1a1a1a',  // Slightly lighter surface
          window: '#2a2a2a',   // Window/card background
          text: '#00ff00',     // Classic green terminal text
          prompt: '#00ffff',   // Cyan for prompts
          success: '#00ff00',  // Green for success
          error: '#ff0000',    // Red for errors
          warning: '#ffff00',  // Yellow for warnings
          comment: '#808080',  // Gray for comments
          accent: '#00ffff',   // Cyan accent
          purple: '#ff00ff',   // Magenta/Purple
          orange: '#ffa500',   // Orange
        }
      }
    },
  },
  plugins: [],
}