import { useState, useEffect } from "react";

export function SplashNotice() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("floral-notepaper-splash-seen");
    if (!hasSeen) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem("floral-notepaper-splash-seen", "1");
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
      onClick={handleClose}
    >
      <div
        className="bg-cloud rounded-2xl shadow-2xl border border-paper-deep/30 p-8 max-w-sm w-full mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-bamboo"
          >
            <path d="M12 3v18" />
            <path d="M8 7c0-2 2-3 4-3s4 1 4 3-2 3-4 3-4-1-4-3" />
            <path d="M8 17c0 2 2 3 4 3s4-1 4-3-2-3-4-3-4 1-4 3" />
            <path d="M8 7v10" />
            <path d="M16 7v10" />
          </svg>
        </div>
        <h2 className="text-xl font-display font-bold text-ink mb-2">花笺</h2>
        <p className="text-sm text-ink-soft mb-1">个人开发项目</p>
        <p className="text-sm text-ink-ghost mb-6">开发人员：25</p>
        <button
          onClick={handleClose}
          className="px-6 py-2 text-sm text-cloud bg-bamboo hover:bg-bamboo-light rounded-lg transition-colors cursor-pointer font-medium"
        >
          开始使用
        </button>
      </div>
    </div>
  );
}
