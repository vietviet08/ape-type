# ApeType

A minimalist Monkeytype-style typing test built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Recharts.

## Stack

- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui (Radix)
- Recharts
- next-themes
- zod

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run build
```

## Routes

- `/` typing test
- `/settings` persistent settings
- `/stats` local result history + charts + import/export
- `/about` product/about page

## Notes

- Settings and history are persisted in `localStorage` with zod validation.
- Last 50 test results are retained.
- Typing input uses a hidden input with IME composition handling.
- Restart shortcuts: `Tab` or `Ctrl+Enter`.
