// Age Verification Module
(() => {
  "use strict";

  const AgeVerification = {
    state: {
      verified: false,
      devToolsOpen: false,
    },

    elements: {},

    blockedKeys: [
      { key: 123 }, // F12
      { key: 73, ctrl: true, shift: true }, // Ctrl+Shift+I
      { key: 67, ctrl: true, shift: true }, // Ctrl+Shift+C
      { key: 74, ctrl: true, shift: true }, // Ctrl+Shift+J
      { key: 85, ctrl: true }, // Ctrl+U
      { key: 83, ctrl: true }, // Ctrl+S
      { key: 65, ctrl: true }, // Ctrl+A
      { key: 80, ctrl: true }, // Ctrl+P
      { key: 27 }, // ESC
    ],

    init() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.setup());
      } else {
        this.setup();
      }
    },

    setup() {
      this.cacheElements();
      this.disableConsole();
      this.attachEventListeners();
      this.initPopup();
      this.startMonitoring();
    },

    cacheElements() {
      this.elements = {
        overlay: document.getElementById("overlay"),
        yesBtn: document.getElementById("yesBtn"),
        noBtn: document.getElementById("noBtn"),
        accessRestricted: document.getElementById("accessRestricted"),
      };
    },

    attachEventListeners() {
      const preventIfNotVerified = (e) => {
        if (!this.state.verified) {
          // Не блокуємо скрол події
          if (
            e.type === "wheel" ||
            e.type === "touchmove" ||
            e.type === "scroll"
          ) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      // Блокування контекстного меню, виділення, копіювання
      ["contextmenu", "selectstart", "copy"].forEach((event) =>
        document.addEventListener(event, preventIfNotVerified)
      );

      // Блокування клавіатурних комбінацій
      document.addEventListener("keydown", (e) => {
        if (this.state.verified) return;

        const isBlocked = this.blockedKeys.some(
          (blocked) =>
            e.keyCode === blocked.key &&
            (!blocked.ctrl || e.ctrlKey) &&
            (!blocked.shift || e.shiftKey)
        );

        if (isBlocked) preventIfNotVerified(e);
      });

      // Блокування кліків на посилання
      document.addEventListener("click", (e) => {
        if (!this.state.verified && e.target.closest("a")) {
          preventIfNotVerified(e);
        }
      });

      // Обробники кнопок
      this.elements.yesBtn?.addEventListener("click", () => this.verify());
      this.elements.noBtn?.addEventListener("click", () =>
        this.showRestricted()
      );

      // Блокування кліків поза попапом
      this.elements.overlay?.addEventListener("click", (e) => {
        if (e.target === this.elements.overlay && !this.state.verified) {
          preventIfNotVerified(e);
        }
      });

      // Дозволяємо скрол в overlay
      this.elements.overlay?.addEventListener(
        "wheel",
        (e) => {
          // Дозволяємо скрол
        },
        { passive: true }
      );

      this.elements.overlay?.addEventListener(
        "touchmove",
        (e) => {
          // Дозволяємо touch скрол
        },
        { passive: true }
      );
    },

    initPopup() {
      if (!this.elements.overlay) return;

      this.elements.overlay.classList.remove("hidden");
      this.elements.overlay.style.display = "flex";
      document.body.classList.add("age-verification-active");

      Object.assign(document.body.style, {
        userSelect: "none",
        webkitUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
      });
    },

    verify() {
      this.state.verified = true;
      this.elements.overlay?.classList.add("hidden");
      document.body.classList.remove("age-verification-active");

      Object.assign(document.body.style, {
        userSelect: "auto",
        pointerEvents: "auto",
        overflow: "auto",
      });
    },

    showRestricted() {
      this.elements.accessRestricted?.classList.add("show");
      this.elements.accessRestricted?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    },

    disableConsole() {
      const noop = () => {};
      [
        "log",
        "warn",
        "error",
        "info",
        "debug",
        "clear",
        "table",
        "group",
        "groupEnd",
      ].forEach((method) => (console[method] = noop));
    },

    detectDevTools() {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (
        (widthDiff > threshold || heightDiff > threshold) &&
        !this.state.devToolsOpen
      ) {
        this.state.devToolsOpen = true;
        document.body.innerHTML = `
          <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                      background:#000;color:#fff;display:flex;align-items:center;
                      justify-content:center;font-size:24px;z-index:99999;">
            Access Denied
          </div>
        `;
      } else if (widthDiff <= threshold && heightDiff <= threshold) {
        this.state.devToolsOpen = false;
      }
    },

    enforcePopup() {
      if (this.state.verified) return;

      const { overlay } = this.elements;
      if (
        overlay &&
        (overlay.style.display === "none" ||
          overlay.classList.contains("hidden"))
      ) {
        overlay.classList.remove("hidden");
        overlay.style.display = "flex";
      }

      if (!document.body.classList.contains("age-verification-active")) {
        document.body.classList.add("age-verification-active");
      }
    },

    startMonitoring() {
      setInterval(() => {
        if (!this.state.verified) this.detectDevTools();
      }, 500);

      setInterval(() => this.enforcePopup(), 100);
    },
  };

  // Запуск модуля
  AgeVerification.init();
})();
