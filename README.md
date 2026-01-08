# Password Strength Meter

An interactive password strength meter demo built for Privacy Day workshops. Helps teach password security concepts in an engaging, hands-on way.

**[Live Demo](https://password-strength-demo.vercel.app)** (deploy your own!)

## Features

- **Password Strength Meter** - Real-time scoring (0-100) with visual feedback
- **Pattern Detection** - Identifies common passwords, keyboard patterns, leet speak, date patterns
- **Passphrase Generator** - Demonstrates the power of word-based passwords
- **Audience Challenge** - Interactive game where participants rank passwords by strength
- **Presenter Mode** - Big text, high contrast, fullscreen for workshops
- **Speaker Notes** - Built-in talk track for presenters
- **100% Client-Side** - No data ever sent or stored anywhere

## Privacy & Security

This tool is designed with privacy in mind:
- Runs entirely in your browser
- No backend, no API calls, no analytics
- No password data is ever transmitted or stored
- Safe for demonstrations with fictional passwords

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Click Deploy

Or use the CLI:
```bash
npm i -g vercel
vercel
```

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Scoring Algorithm

The password strength score is calculated based on:

| Factor | Weight |
|--------|--------|
| Length (most important) | Up to 60 points |
| Character variety | Up to 20 points |
| Passphrase bonus | Up to 20 points |
| Pattern penalties | -5 to -50 points |

### Length Thresholds
- 8+ characters: Minimum
- 12+ characters: Recommended
- 16+ characters: Excellent
- 20+ characters: Maximum length score

### Detected Patterns
- Common passwords (password, 123456, qwerty, etc.)
- Keyboard walks (qwerty, asdf, zxcv)
- Sequential characters (123, abc)
- Year patterns (2024, 1990)
- Season/month patterns (Summer2024)
- Leet speak substitutions (P@ssw0rd)

## Workshop Usage

### Presenter Mode
Click "Big Text" and "High Contrast" for better visibility on projectors.

### Speaker Notes
Toggle "Speaker Notes" to see talking points for each section.

### Audience Challenge
Use the "Audience Challenge" tab for an interactive ranking game:
- 4 random passwords displayed each round
- Audience votes on which is strongest
- Reveal answers with explanations
- Click "New Round" for fresh passwords

## License

MIT - Use freely for educational purposes.

## Contributing

Contributions welcome! Please open an issue or PR.
