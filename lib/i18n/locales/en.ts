export const en = {
  app: {
    name: "ApeType",
  },
  nav: {
    typing: "Typing",
    settings: "Settings",
    stats: "Stats",
    about: "About",
    primaryAria: "Primary navigation",
  },
  language: {
    label: "Language",
    english: "English",
    vietnamese: "Tiếng Việt",
    japanese: "日本語",
  },
  common: {
    actions: {
      start: "Start",
      save: "Save",
      export: "Export",
      import: "Import",
      reset: "Reset",
      clear: "Clear",
      close: "Close",
    },
    theme: {
      toggle: "Toggle theme",
    },
  },
  typing: {
    title: "Typing Test",
    description:
      "ApeType keeps the interface minimal while tracking speed, raw pace, and accuracy in real time.",
    loading: {
      engine: "Loading typing engine...",
    },
    button: {
      restart: "Restart",
    },
    mode: {
      label: "Mode",
      time: "Time",
      words: "Words",
    },
    wordList: {
      label: "Word list",
      english1k: "English 1k",
      english5k: "English 5k",
      vietnameseCore: "Vietnamese core",
    },
    hint: {
      focus: "Tap to focus",
      restart: "Press Tab or Ctrl+Enter to restart",
      hiddenInput: "Hidden input capture enabled",
      ime: "IME composition in progress",
      stopOnWordBlocked: "Stop-on-word blocked: finish the current word first.",
      seed: "Seed {seed}",
    },
    time: {
      label: "Time left {time}",
    },
    words: {
      label: "{count} words left",
    },
    progress: {
      typed: "{count} words typed",
      words: "Progress {current}/{total}",
    },
    result: {
      title: "Test Complete",
      wpm: "WPM",
      raw: "Raw WPM",
      accuracy: "Accuracy",
      errors: "Errors",
      time: "Time",
      restart: "Restart",
    },
    aria: {
      restartTest: "Restart test",
      testArea: "Typing test area",
      hiddenInput: "Hidden typing input",
      prompt: "Typing prompt",
    },
    error: {
      title: "Typing engine crashed",
      unexpected: "Unexpected error.",
      retry: "Try again",
    },
  },
  settings: {
    title: "Settings",
    description:
      "Configure your test defaults and typing behavior. Changes are saved automatically.",
    loading: "Loading settings...",
    mode: {
      title: "Test Mode",
    },
    wordList: {
      label: "Word list",
    },
    theme: {
      label: "Theme",
      dark: "Dark",
      light: "Light",
      system: "System",
    },
    behavior: {
      title: "Behavior",
      punctuation: {
        label: "Punctuation",
        description: "Append random punctuation marks to words.",
      },
      numbers: {
        label: "Numbers",
        description: "Inject short digit groups into random words.",
      },
      capitalize: {
        label: "Capitalize",
        description: "Apply sentence casing across generated words.",
      },
      stopOnWord: {
        label: "Stop on word",
        description: "Prevent advancing if the current word is incorrect.",
      },
    },
    sound: {
      label: "Key sound",
      description: "Play a subtle click on each printable key press.",
    },
    storage: {
      title: "Storage",
      description: "Settings are versioned and persisted in localStorage.",
    },
    save: "Save",
    reset: "Reset to defaults",
    schema: "schema v{version}",
  },
  stats: {
    title: "Stats",
    description:
      "ApeType stores your latest 50 tests locally and visualizes pace trends over time.",
    performance: {
      title: "Performance Trend",
    },
    empty: "No tests recorded yet.",
    export: "Export JSON",
    import: "Import JSON",
    clear: "Clear",
    importError: "Failed to import stats.",
    recent: "Recent Tests ({count})",
    table: {
      date: "Date",
      mode: "Mode",
      target: "Target",
      wpm: "WPM",
      raw: "Raw",
      accuracy: "Acc",
      errors: "Errors",
    },
    mode: {
      time: "Time",
      words: "Words",
    },
    target: {
      seconds: "{count}s",
      words: "{count} words",
    },
  },
  about: {
    title: "About ApeType",
    description:
      "ApeType is an original typing test experience inspired by minimalist speed trainers.",
    card: {
      title: "Built for flow",
      body1:
        "The interface keeps visual noise low while preserving precision feedback: current character, word-level correctness, real-time WPM, and end-of-test trends.",
      body2:
        "Tests are reproducible via seeds, settings persist locally, and all stats stay on your device unless you explicitly export them.",
    },
  },
} as const;

export type LocaleDictionary = typeof en;
