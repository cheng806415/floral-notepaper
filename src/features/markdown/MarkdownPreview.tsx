import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { openUrl } from "@tauri-apps/plugin-opener";
import type { Components } from "react-markdown";

interface MarkdownPreviewProps {
  content: string;
}

const remarkPlugins = [remarkGfm];

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-[22px] font-display font-bold text-ink mt-6 mb-4 tracking-wide">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-[17px] font-display font-bold text-ink mt-7 mb-3 tracking-wide">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[15px] font-display font-bold text-ink mt-5 mb-2 tracking-wide">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-[14px] font-display font-semibold text-ink mt-4 mb-2 tracking-wide">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-ink-soft leading-[1.9]">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-bamboo-light">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-bamboo/40 pl-4 my-3 text-ink-soft/80 italic leading-[1.9]">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="ml-4 text-ink-soft leading-[1.9] list-disc list-outside marker:text-bamboo/40">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="ml-4 text-ink-soft leading-[1.9] list-decimal list-outside marker:text-bamboo/50 marker:font-mono marker:text-[12px]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-ink-soft leading-[1.9]">{children}</li>
  ),
  hr: () => (
    <hr className="my-6 border-none h-px bg-gradient-to-r from-transparent via-paper-deep to-transparent" />
  ),
  code: ({ className, children }) => {
    const isBlock = className?.startsWith("language-") || String(children).includes("\n");
    if (isBlock) {
      return (
        <code className="text-[12px] font-mono text-ink-soft leading-[1.8] whitespace-pre">
          {children}
        </code>
      );
    }
    return (
      <code className="px-1.5 py-0.5 text-[12px] font-mono bg-paper-warm rounded text-bamboo">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-3 px-4 py-3 rounded bg-paper-warm/80 overflow-x-auto">
      {children}
    </pre>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        if (href) openUrl(href);
      }}
      className="text-bamboo hover:text-bamboo-light underline underline-offset-2 cursor-pointer"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="text-left px-3 py-1.5 border-b border-paper-deep/30 font-semibold text-ink text-[12px]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-1.5 border-b border-paper-deep/15 text-ink-soft">
      {children}
    </td>
  ),
  input: ({ checked, ...props }) => (
    <input
      {...props}
      checked={checked}
      disabled
      className="mr-1.5 accent-bamboo"
    />
  ),
};

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="max-w-[560px] text-[14px] font-body">
      {content.trim() ? (
        <Markdown remarkPlugins={remarkPlugins} components={components}>
          {content}
        </Markdown>
      ) : (
        <p className="text-ink-ghost leading-[1.9]">预览区会显示当前笔记内容</p>
      )}
    </div>
  );
}
