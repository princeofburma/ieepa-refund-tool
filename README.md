This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Agent tooling: Printing Press

This repo ships a one-shot installer for the [Printing Press](https://printingpress.dev) CLI factory and its starter-pack of pre-built CLIs, so a Claude Code session can generate ship-ready Go CLIs from any API spec, website, or HAR file.

```bash
./scripts/setup-printing-press.sh
```

Prerequisites:
- Go 1.26.3+ ([go.dev/dl](https://go.dev/dl/)) — older versions still work via `GOTOOLCHAIN=auto`
- Node.js 20+ (`npx`)
- [Claude Code](https://docs.claude.com/en/docs/claude-code/overview)

What it installs:
- `printing-press` factory binary at `$(go env GOPATH)/bin/printing-press`
- 9 factory meta-skills under `~/.claude/skills/printing-press*`
- Starter-pack CLIs (`espn`, `flight-goat`, `movie-goat`, `recipe-goat`) and matching `pp-*` skills

Once installed, drive it from inside Claude Code:
- `/printing-press <api-name-or-url>` — generate a CLI
- `/printing-press-catalog` — browse pre-built CLIs in the library hub

See the upstream repos for full docs: [cli-printing-press](https://github.com/mvanhorn/cli-printing-press), [printing-press-library](https://github.com/mvanhorn/printing-press-library).
