import type { LocaleDictionary } from "@/lib/i18n/locales/en";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]>;
};

export const vi: DeepPartial<LocaleDictionary> = {
  app: {
    name: "ApeType",
  },
  nav: {
    typing: "Gõ phím",
    settings: "Cài đặt",
    stats: "Thống kê",
    about: "Giới thiệu",
    primaryAria: "Điều hướng chính",
  },
  language: {
    label: "Ngôn ngữ",
    english: "English",
    vietnamese: "Tiếng Việt",
    japanese: "日本語",
  },
  common: {
    actions: {
      start: "Bắt đầu",
      save: "Lưu",
      export: "Xuất",
      import: "Nhập",
      reset: "Đặt lại",
      clear: "Xóa",
      close: "Đóng",
    },
    theme: {
      toggle: "Chuyển giao diện",
    },
  },
  typing: {
    title: "Bài test gõ",
    description:
      "ApeType giữ giao diện tối giản nhưng vẫn theo dõi tốc độ, tốc độ thô và độ chính xác theo thời gian thực.",
    loading: {
      engine: "Đang tải bộ máy gõ...",
    },
    button: {
      restart: "Làm lại",
    },
    mode: {
      label: "Chế độ",
      time: "Thời gian",
      words: "Số từ",
    },
    wordList: {
      label: "Danh sách từ",
      english1k: "Tiếng Anh 1k",
      english5k: "Tiếng Anh 5k",
      vietnameseCore: "Tiếng Việt cơ bản",
    },
    hint: {
      focus: "Chạm để nhập",
      restart: "Nhấn Tab hoặc Ctrl+Enter để làm lại",
      hiddenInput: "Đang bật bắt phím ẩn",
      ime: "Đang nhập bằng IME",
      stopOnWordBlocked: "Chặn theo từ: hãy gõ đúng từ hiện tại trước.",
      seed: "Seed {seed}",
    },
    time: {
      label: "Còn {time}",
    },
    words: {
      label: "Còn {count} từ",
    },
    progress: {
      typed: "Đã gõ {count} từ",
      words: "Tiến độ {current}/{total}",
    },
    result: {
      title: "Hoàn thành bài test",
      wpm: "WPM",
      raw: "WPM thô",
      accuracy: "Độ chính xác",
      errors: "Lỗi",
      time: "Thời gian",
      restart: "Làm lại",
    },
    aria: {
      restartTest: "Làm lại bài test",
      testArea: "Vùng bài test gõ",
      hiddenInput: "Ô nhập gõ ẩn",
      prompt: "Nội dung gõ",
    },
    error: {
      title: "Bộ máy gõ gặp lỗi",
      unexpected: "Lỗi không mong muốn.",
      retry: "Thử lại",
    },
  },
  settings: {
    title: "Cài đặt",
    description:
      "Thiết lập mặc định cho bài test và hành vi gõ. Thay đổi được lưu tự động.",
    loading: "Đang tải cài đặt...",
    mode: {
      title: "Chế độ bài test",
    },
    wordList: {
      label: "Danh sách từ",
    },
    theme: {
      label: "Giao diện",
      dark: "Tối",
      light: "Sáng",
      system: "Hệ thống",
    },
    behavior: {
      title: "Hành vi",
      punctuation: {
        label: "Dấu câu",
        description: "Thêm ngẫu nhiên dấu câu vào từ.",
      },
      numbers: {
        label: "Số",
        description: "Chèn các cụm chữ số ngắn vào từ ngẫu nhiên.",
      },
      capitalize: {
        label: "Viết hoa",
        description: "Áp dụng kiểu viết hoa câu cho từ được tạo.",
      },
      stopOnWord: {
        label: "Dừng theo từ",
        description: "Không cho qua từ tiếp theo nếu từ hiện tại sai.",
      },
    },
    sound: {
      label: "Âm phím",
      description: "Phát tiếng click nhẹ cho mỗi phím in được.",
    },
    storage: {
      title: "Lưu trữ",
      description: "Cài đặt có phiên bản và được lưu trong localStorage.",
    },
    save: "Lưu",
    reset: "Đặt lại mặc định",
    schema: "schema v{version}",
  },
  stats: {
    title: "Thống kê",
    description:
      "ApeType lưu 50 bài test gần nhất trên máy của bạn và trực quan hóa xu hướng tốc độ theo thời gian.",
    performance: {
      title: "Xu hướng hiệu suất",
    },
    empty: "Chưa có bài test nào.",
    export: "Xuất JSON",
    import: "Nhập JSON",
    clear: "Xóa",
    importError: "Không thể nhập dữ liệu thống kê.",
    recent: "Bài test gần đây ({count})",
    table: {
      date: "Ngày",
      mode: "Chế độ",
      target: "Mục tiêu",
      wpm: "WPM",
      raw: "Thô",
      accuracy: "Chính xác",
      errors: "Lỗi",
    },
    mode: {
      time: "Thời gian",
      words: "Số từ",
    },
    target: {
      seconds: "{count} giây",
      words: "{count} từ",
    },
  },
  about: {
    title: "Về ApeType",
    description:
      "ApeType là trải nghiệm test gõ nguyên bản, lấy cảm hứng từ các công cụ luyện tốc độ tối giản.",
    card: {
      title: "Thiết kế để giữ flow",
      body1:
        "Giao diện giảm nhiễu thị giác nhưng vẫn giữ phản hồi chính xác: ký tự hiện tại, độ đúng theo từ, WPM theo thời gian thực và xu hướng cuối bài.",
      body2:
        "Bài test có thể tái lập bằng seed, cài đặt được lưu cục bộ và toàn bộ thống kê nằm trên thiết bị của bạn trừ khi bạn chủ động xuất dữ liệu.",
    },
  },
};
