# Notton.ai

A modern task management and productivity application built with React, TypeScript, and Tailwind CSS.

## Features

- **Smart Task Organization**: Organize tasks by categories (Work, Academics, Personal, Well-being)
- **Time & Energy Filtering**: Filter tasks by time duration (15m, 30m, 1h) and energy level (Low, Medium, High)
- **AI-Powered Recommendations**: Get personalized task recommendations based on your context
- **Where You Left Off**: Quickly resume tasks you were working on
- **Chat Interface**: Interactive chat modal for task management
- **Modern UI**: Built with Radix UI components and Tailwind CSS v4

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variant management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd notton.ai
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/        # React components
│   ├── ui/          # Reusable UI components (Radix UI based)
│   └── ...          # Feature components
├── styles/          # Global styles and Tailwind configuration
└── main.tsx         # Application entry point
```

## License

MIT License - see [LICENSE](LICENSE) file for details
