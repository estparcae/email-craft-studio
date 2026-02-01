# Email Craft Studio

Professional email HTML generator with brand kit system, built with Next.js.

## Project Overview

Email Craft Studio is a visual email builder that creates table-based, email-client-compatible HTML emails. It features a brand kit system, template library, and block-based email composition.

## Getting Started

### Prerequisites

- Node.js 18+ & npm
- [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd email-craft-studio

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Technologies

This project is built with:

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - UI library
- **shadcn/ui** - Component library (Radix UI + Tailwind CSS)
- **Tailwind CSS** - Utility-first CSS
- **TanStack React Query** - Server state management
- **Vitest** - Testing framework

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
email-craft-studio/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── providers.tsx # Client providers
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── *.tsx        # Feature components
│   ├── context/         # React Context providers
│   ├── core/            # Business logic
│   │   ├── brandParser.ts
│   │   ├── emailRenderer.ts
│   │   ├── storage.ts
│   │   ├── templates.ts
│   │   └── compatibilityChecker.ts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities
│   ├── types/           # TypeScript definitions
│   └── test/            # Test setup
├── public/              # Static assets
└── package.json
```

## Features

- **Brand Kit System** - Manage colors, logos, and typography
- **Block-Based Editor** - Compose emails with drag-and-drop blocks
- **Template Library** - Pre-built email templates (newsletter, announcement, event)
- **Live Preview** - Desktop and mobile preview modes
- **Dark Mode Support** - Email-safe dark mode rendering
- **Export Options** - HTML export with compatibility checks
- **WCAG Compliance** - Automated contrast checking
- **Email Client Testing** - Compatibility recommendations

## Deployment

This project can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting platform**

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
