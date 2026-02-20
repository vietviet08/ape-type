# ApeType

A minimalist, open-source typing test built from scratch with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**.

> _ApeType keeps the interface minimal while tracking speed, raw pace, and accuracy in real time._

---

## Features

| Category               | Details                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| **Test modes**         | Time-based (15 / 30 / 60 / 120 s) or word-count (10 / 25 / 50 / 100 words) |
| **Word lists**         | English 1 k, English 5 k, and Vietnamese Core built-in                     |
| **Customization**      | Punctuation, numbers, capitalization, stop-on-word, key sound              |
| **Real-time metrics**  | WPM, raw WPM, accuracy, correct / incorrect / total characters             |
| **Results dialog**     | Per-second WPM + accuracy chart powered by Recharts                        |
| **Stats dashboard**    | Last 50 tests with trend chart, history table, JSON import / export        |
| **Reproducible tests** | Each test is seeded — same seed = same word sequence                       |
| **Theme**              | Dark / Light / System via `next-themes`                                    |
| **Persistence**        | Settings & history stored in `localStorage` with Zod schema validation     |
| **Keyboard shortcuts** | `Tab` or `Ctrl + Enter` to restart                                         |
| **IME support**        | Composition events handled for CJK / multi-byte input methods              |

---

## Tech Stack

| Layer      | Technology                                                |
| ---------- | --------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language   | TypeScript (strict mode)                                  |
| Styling    | Tailwind CSS v4 + `tw-animate-css`                        |
| Components | [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)    |
| Charts     | [Recharts](https://recharts.org/)                         |
| Theming    | [next-themes](https://github.com/pacocoursey/next-themes) |
| Validation | [Zod](https://zod.dev/)                                   |
| Icons      | [Lucide React](https://lucide.dev/)                       |
| Linting    | ESLint + Prettier (with `prettier-plugin-tailwindcss`)    |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (the repo pins `npm@11.3.0` via `packageManager`)

### Install & run

```bash
# Clone the repository
git clone https://github.com/<your-username>/ape-type.git
cd ape-type

# Install dependencies
npm install

# Start the dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available scripts

| Script                 | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start Next.js dev server with Turbopack |
| `npm run build`        | Production build                        |
| `npm run start`        | Serve the production build              |
| `npm run lint`         | ESLint (`--max-warnings=0`)             |
| `npm run format`       | Prettier — format all files             |
| `npm run format:check` | Prettier — check formatting             |

---

## Project Structure

```
ape-type/
├── app/                      # Next.js App Router
│   ├── globals.css           # Tailwind base + custom tokens
│   ├── layout.tsx            # Root layout
│   ├── providers.tsx         # Client providers (theme, settings, tooltip)
│   ├── (app)/                # Main app route group
│   │   ├── page.tsx          # / — Typing test
│   │   ├── settings/page.tsx # /settings — Persistent settings
│   │   └── stats/page.tsx    # /stats — History & charts
│   └── (marketing)/          # Marketing route group
│       └── about/page.tsx    # /about — About page
├── components/
│   ├── layout/               # Header, container, theme toggle
│   ├── providers/            # SettingsProvider, ThemeProvider
│   ├── typing/               # Core typing components
│   │   ├── typing-shell.tsx  # Main typing logic & UI
│   │   ├── typing-island.tsx # Dynamic loader + session key
│   │   ├── typing-display.tsx# Word rows + caret rendering
│   │   ├── results-dialog.tsx# End-of-test results modal
│   │   ├── stats-dashboard.tsx# Stats page charts & table
│   │   ├── settings-panel.tsx# Settings page controls
│   │   └── ...
│   └── ui/                   # shadcn/ui primitives
├── hooks/                    # Custom React hooks
├── lib/
│   ├── typing-engine.ts      # Pure word generation & analysis
│   ├── metrics.ts            # WPM / accuracy calculation
│   ├── rng.ts                # Seeded PRNG
│   ├── storage.ts            # localStorage helpers (Zod-validated)
│   └── wordlists/            # JSON word lists + index
├── types/                    # Shared TypeScript types & constants
└── public/                   # Static assets
```

---

## Routes

| Path        | Description                                                                 |
| ----------- | --------------------------------------------------------------------------- |
| `/`         | Typing test — real-time WPM, accuracy, and per-second sampling              |
| `/settings` | Toggle punctuation, numbers, capitalization, stop-on-word, key sound, theme |
| `/stats`    | Last 50 results, trend chart, history table, JSON import / export           |
| `/about`    | Project overview                                                            |

---

## How It Works

1. **Word generation** — A seeded PRNG (`lib/rng.ts`) produces a deterministic word sequence from the selected word list, optionally injecting punctuation, numbers, and capitalization.
2. **Hidden input capture** — A visually hidden `<input>` captures keystrokes (including IME composition), keeping the UI clean while maintaining native text-editing behaviour.
3. **Real-time metrics** — An 80 ms interval samples elapsed time; every second, WPM and accuracy are recorded for the post-test chart.
4. **Session isolation** — `TypingIsland` derives a `key` from all relevant settings. Changing any setting remounts `TypingShell`, resetting state cleanly.
5. **Persistence** — `localStorage` stores both settings (schema-versioned) and the last 50 test results, validated on read with Zod.

---

## License

This project is for personal / educational use. See [LICENSE](LICENSE) if a license file is present.
