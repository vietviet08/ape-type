import type { LocaleDictionary } from "@/lib/i18n/locales/en";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]>;
};

export const ja: DeepPartial<LocaleDictionary> = {
  app: {
    name: "ApeType",
  },
  nav: {
    typing: "タイピング",
    settings: "設定",
    stats: "統計",
    about: "概要",
    primaryAria: "メインナビゲーション",
  },
  language: {
    label: "言語",
    english: "English",
    vietnamese: "Tiếng Việt",
    japanese: "日本語",
  },
  common: {
    actions: {
      start: "開始",
      save: "保存",
      export: "書き出し",
      import: "読み込み",
      reset: "リセット",
      clear: "クリア",
      close: "閉じる",
    },
    theme: {
      toggle: "テーマ切り替え",
    },
  },
  typing: {
    title: "タイピングテスト",
    description:
      "ApeType はミニマルなUIのまま、速度・Raw速度・正確率をリアルタイムで表示します。",
    loading: {
      engine: "タイピングエンジンを読み込み中...",
    },
    button: {
      restart: "リスタート",
    },
    mode: {
      label: "モード",
      time: "時間",
      words: "単語",
    },
    wordList: {
      label: "単語リスト",
      english1k: "英語 1k",
      english5k: "英語 5k",
      vietnameseCore: "ベトナム語 コア",
    },
    hint: {
      focus: "タップしてフォーカス",
      restart: "Tab または Ctrl+Enter でリスタート",
      hiddenInput: "隠し入力キャプチャ有効",
      ime: "IME 変換中",
      stopOnWordBlocked: "単語停止: 現在の単語を正しく入力してから進んでください。",
      seed: "Seed {seed}",
    },
    time: {
      label: "残り {time}",
    },
    words: {
      label: "残り {count}語",
    },
    progress: {
      typed: "{count}語入力済み",
      words: "進捗 {current}/{total}",
    },
    result: {
      title: "テスト完了",
      wpm: "WPM",
      raw: "Raw WPM",
      accuracy: "正確率",
      errors: "ミス",
      time: "時間",
      restart: "リスタート",
    },
    aria: {
      restartTest: "テストをリスタート",
      testArea: "タイピングテストエリア",
      hiddenInput: "隠しタイピング入力",
      prompt: "タイピング表示",
    },
    error: {
      title: "タイピングエンジンが停止しました",
      unexpected: "予期しないエラーです。",
      retry: "再試行",
    },
  },
  settings: {
    title: "設定",
    description:
      "テストの既定値と入力挙動を設定します。変更は自動で保存されます。",
    loading: "設定を読み込み中...",
    mode: {
      title: "テストモード",
    },
    wordList: {
      label: "単語リスト",
    },
    theme: {
      label: "テーマ",
      dark: "ダーク",
      light: "ライト",
      system: "システム",
    },
    behavior: {
      title: "挙動",
      punctuation: {
        label: "句読点",
        description: "単語にランダムな句読点を追加します。",
      },
      numbers: {
        label: "数字",
        description: "単語に短い数字グループをランダムに挿入します。",
      },
      capitalize: {
        label: "先頭大文字",
        description: "生成単語に文頭スタイルの大文字化を適用します。",
      },
      stopOnWord: {
        label: "単語ごと停止",
        description: "現在の単語が誤りなら次へ進めません。",
      },
    },
    sound: {
      label: "キー音",
      description: "入力可能キーごとに軽いクリック音を鳴らします。",
    },
    storage: {
      title: "ストレージ",
      description: "設定はバージョン管理され、localStorage に保存されます。",
    },
    save: "保存",
    reset: "デフォルトに戻す",
    schema: "schema v{version}",
  },
  stats: {
    title: "統計",
    description:
      "ApeType は最新50件のテストをローカル保存し、速度推移を可視化します。",
    performance: {
      title: "パフォーマンストレンド",
    },
    empty: "まだテスト記録がありません。",
    export: "JSONを書き出し",
    import: "JSONを読み込み",
    clear: "クリア",
    importError: "統計データを読み込めませんでした。",
    recent: "最近のテスト ({count})",
    table: {
      date: "日時",
      mode: "モード",
      target: "目標",
      wpm: "WPM",
      raw: "Raw",
      accuracy: "正確率",
      errors: "ミス",
    },
    mode: {
      time: "時間",
      words: "単語",
    },
    target: {
      seconds: "{count}秒",
      words: "{count}語",
    },
  },
  about: {
    title: "ApeType について",
    description:
      "ApeType は、ミニマルなスピードトレーナーに着想を得たオリジナルのタイピング体験です。",
    card: {
      title: "集中できる設計",
      body1:
        "視覚ノイズを抑えつつ、現在文字・単語単位の正誤・リアルタイムWPM・終了後の推移を正確にフィードバックします。",
      body2:
        "テストは seed で再現可能、設定はローカル保存、統計は明示的に書き出さない限り端末内に留まります。",
    },
  },
};
