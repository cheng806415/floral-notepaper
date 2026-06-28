import { Component, type ErrorInfo, type ReactNode } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getErrorMessage } from "../features/notes/api";

interface NotePadErrorBoundaryProps {
  children: ReactNode;
}

interface NotePadErrorBoundaryState {
  error: Error | null;
}

/**
 * NotePad 内部错误边界
 *
 * 包裹 NotePad 编辑器区域。当 AI 生成标题或其他子组件抛错时，
 * 不让整个 NotePad 窗口变空白，而是显示降级 UI + 错误详情。
 */
export class NotePadErrorBoundary extends Component<
  NotePadErrorBoundaryProps,
  NotePadErrorBoundaryState
> {
  state: NotePadErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): NotePadErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // 输出到浏览器控制台
    console.error("[NotePadErrorBoundary] caught error:", error, info);
    // 发送到 Rust 后端，直接输出到终端
    invoke("log_frontend_error", {
      message: `[NotePadErrorBoundary] ${error.message}`,
      stack: info.componentStack ?? null,
    }).catch((invokeErr) => {
      console.error("[NotePadErrorBoundary] invoke log_frontend_error failed:", invokeErr);
    });
  }

  handleRetry = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      const message = getErrorMessage(this.state.error);
      return (
        <div className="flex flex-col items-center justify-center w-full h-full px-6 py-8 gap-3 text-center">
          <div className="w-10 h-10 rounded-full bg-red-100/80 flex items-center justify-center text-red-500">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-[13px] font-medium text-ink-soft">
            编辑器遇到了一个问题
          </p>
          <p className="text-[11px] text-ink-faint max-w-[320px] leading-relaxed break-words">
            {message}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-1 px-4 py-1.5 text-[12px] text-cloud bg-bamboo hover:bg-bamboo-light rounded-lg transition-all duration-200 font-medium cursor-pointer"
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
