# CV Terminal

A Linux terminal-style CV visualizer built with Next.js and TypeScript. This interactive web application presents professional information through authentic terminal commands, featuring a classic retro computing aesthetic.

## 🚀 Features

- **Terminal Interface**: Authentic Linux terminal experience with bash-style prompts
- **Interactive Commands**: Explore CV sections through terminal commands
- **CV Data Caching**: Configurable TTL caching for live CV data from external API
- **Retro Aesthetic**: Classic green-on-black terminal styling with text glow effects
- **Responsive Design**: Professional terminal window with macOS-style controls
- **ASCII Art**: Welcome banner with stylized terminal branding

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - Modern state management
- **PostCSS** - CSS processing

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd cv-terminal

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 Available Commands

- `help` - Display all available commands with descriptions
- `info` - Show personal information and professional summary
- `work` - Display work experience and career history
- `education` - Show educational background
- `skills` - List technical skills and proficiencies
- `projects` - Display project portfolio with technologies
- `languages` - Show language proficiencies
- `interests` - Display personal interests and hobbies
- `contact` - Show contact information and social profiles
- `cache` - Display cache status and data freshness
- `clear` - Clear terminal history
- `whoami` - Display current user information

## 🔧 Configuration

The application fetches CV data from `https://st2projects.com/cv/cv.json` with configurable TTL caching (default: 5 minutes). The cache can be managed through the terminal interface.

## 🚀 Automatic Deployment

This project is configured for automatic deployment to Cloudflare Pages via GitHub Actions. Every commit to the `main` branch triggers a new deployment.

### Setup GitHub Secrets

To enable automatic deployment, add these secrets to your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following repository secrets:

```
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=2e77fb904446cac18196b98345e8bf86
```

### Getting Your Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template with these permissions:
   - **Account** - Cloudflare Pages:Write
   - **Zone** - Zone:Read (if using custom domain)
   - **Account Resources** - Include All accounts
4. Copy the generated token and add it as `CLOUDFLARE_API_TOKEN` secret

The deployment workflow will automatically:
- Install dependencies
- Build the Next.js application 
- Deploy to Cloudflare Pages
- Update the live site at your custom domain

## 🎨 Design Features

- **Classic Terminal Aesthetic**: Bright green text on deep black background
- **Professional Window Frame**: Centered terminal with gradient header
- **Authentic Prompts**: Real bash-style command prompts
- **Structured Output**: Professional formatting with box-drawing characters
- **Smooth Animations**: Typing effects and loading indicators
- **Glow Effects**: Text shadows for authentic retro computing feel

## 📱 Usage

1. Open the application in your web browser
2. Type `help` to see all available commands
3. Use any command to explore different CV sections
4. Commands are case-insensitive with tab completion support
5. Use `clear` to reset the terminal screen

## 🌟 Live Demo

Visit the live application to interact with the CV terminal and explore the professional background through an engaging command-line interface.

---

**Built with ❤️ using modern web technologies to create a nostalgic terminal experience.**