import { useTranslation } from "react-i18next";
import {
  closeCurrentWindow,
  minimizeCurrentWindow,
  toggleMaximizeCurrentWindow,
} from "../features/windows/controls";

interface TrafficLightsProps {
  /** 当前窗口是否已最大化,用于切换 maximize/restore 行为 */
  isMaximized?: boolean;
  /** 自定义尺寸,默认 13px (macOS 标准) */
  size?: number;
  /** 是否显示提示工具栏 (用于 NotePad 等不带文案的窗口) */
  withTooltips?: boolean;
  /** 自定义点击行为,默认调用原生窗口控制 */
  onMinimize?: () => void | Promise<void>;
  onMaximize?: () => void | Promise<void>;
  onClose?: () => void | Promise<void>;
  /** 额外类名,用于外层容器微调 */
  className?: string;
}

/**
 * macOS 风格的"红黄绿"交通灯窗口控制
 *
 * - 默认放在窗口左上角
 * - 静止时只显示实心圆点,鼠标移上去才显示内部符号(横线 / 加号 / 叉号)
 * - 颜色采用 macOS Sonoma 配色
 */
export function TrafficLights({
  isMaximized = false,
  size = 13,
  withTooltips = true,
  onMinimize,
  onMaximize,
  onClose,
  className = "",
}: TrafficLightsProps) {
  const { t } = useTranslation();

  const handleMinimize = () => {
    if (onMinimize) return void onMinimize();
    void minimizeCurrentWindow();
  };
  const handleMaximize = () => {
    if (onMaximize) return void onMaximize();
    void toggleMaximizeCurrentWindow();
  };
  const handleClose = () => {
    if (onClose) return void onClose();
    void closeCurrentWindow();
  };

  const dotClass =
    "flex items-center justify-center rounded-full transition-all duration-150 group-hover/light:scale-105 group/light";

  // 圆点内符号:静止时不渲染,仅 hover 时显示 (macOS 原生行为)
  const iconStroke = "rgba(0, 0, 0, 0.55)";

  return (
    <div
      className={`group/lights flex items-center gap-[7px] ${className}`}
      data-tauri-drag-region={false}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {/* 关闭 — 红 */}
      <button
        type="button"
        onClick={handleClose}
        aria-label={t("main.window.close", { defaultValue: "关闭" })}
        title={withTooltips ? t("main.window.close", { defaultValue: "关闭" }) : undefined}
        className={`group/light ${dotClass} border border-black/15`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: "#ff5f57",
        }}
        onMouseEnter={(event) => {
          (event.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff7060";
        }}
        onMouseLeave={(event) => {
          (event.currentTarget as HTMLButtonElement).style.backgroundColor = "#ff5f57";
        }}
      >
        <svg
          width={size - 7}
          height={size - 7}
          viewBox="0 0 8 8"
          className="opacity-0 group-hover/light:opacity-100 transition-opacity duration-100"
          aria-hidden="true"
        >
          <path
            d="M1 1 L7 7 M7 1 L1 7"
            stroke={iconStroke}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 最小化 — 黄 */}
      <button
        type="button"
        onClick={handleMinimize}
        aria-label={t("main.window.minimize", { defaultValue: "最小化" })}
        title={withTooltips ? t("main.window.minimize", { defaultValue: "最小化" }) : undefined}
        className={`group/light ${dotClass} border border-black/15`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: "#febc2e",
        }}
        onMouseEnter={(event) => {
          (event.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffcc4a";
        }}
        onMouseLeave={(event) => {
          (event.currentTarget as HTMLButtonElement).style.backgroundColor = "#febc2e";
        }}
      >
        <svg
          width={size - 5}
          height={size - 9}
          viewBox="0 0 8 4"
          className="opacity-0 group-hover/light:opacity-100 transition-opacity duration-100"
          aria-hidden="true"
        >
          <path d="M1 2 L7 2" stroke={iconStroke} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      {/* 最大化 / 还原 — 绿 */}
      <button
        type="button"
        onClick={handleMaximize}
        aria-label={
          isMaximized
            ? t("main.window.restore", { defaultValue: "还原" })
            : t("main.window.maximize", { defaultValue: "最大化" })
        }
        title={
          withTooltips
            ? isMaximized
              ? t("main.window.restore", { defaultValue: "还原" })
              : t("main.window.maximize", { defaultValue: "最大化" })
            : undefined
        }
        className={`group/light ${dotClass} border border-black/15`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: "#28c840",
        }}
        onMouseEnter={(event) => {
          (event.currentTarget as HTMLButtonElement).style.backgroundColor = "#3ad955";
        }}
        onMouseLeave={(event) => {
          (event.currentTarget as HTMLButtonElement).style.backgroundColor = "#28c840";
        }}
      >
        {isMaximized ? (
          <svg
            width={size - 7}
            height={size - 7}
            viewBox="0 0 8 8"
            className="opacity-0 group-hover/light:opacity-100 transition-opacity duration-100"
            aria-hidden="true"
          >
            <path
              d="M2 6 L6 2 M3 2 L6 2 L6 5"
              stroke={iconStroke}
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        ) : (
          <svg
            width={size - 7}
            height={size - 7}
            viewBox="0 0 8 8"
            className="opacity-0 group-hover/light:opacity-100 transition-opacity duration-100"
            aria-hidden="true"
          >
            <path
              d="M1 1 L7 1 L7 7 L1 7 Z M1 1 L7 7 M7 1 L1 7"
              stroke={iconStroke}
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
