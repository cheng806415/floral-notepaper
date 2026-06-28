import type { AiProviderConfig } from "../settings/types";

const DEFAULT_TITLE_PROMPT =
  "请为以下笔记内容生成一个简洁、准确的标题，不超过20个字，不要加引号，不要加任何前缀或解释：";

// ── OpenAI Chat Completions types ──

interface OpenAiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAiRequest {
  model: string;
  messages: OpenAiMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface OpenAiResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

// ── Anthropic Messages types ──

interface AnthropicContentBlock {
  type: "text";
  text: string;
}

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string | AnthropicContentBlock[];
}

interface AnthropicRequest {
  model: string;
  messages: AnthropicMessage[];
  max_tokens: number;
  system?: string;
  temperature?: number;
  stream?: boolean;
}

interface AnthropicResponse {
  content?: AnthropicContentBlock[];
  error?: {
    message?: string;
  };
}

// ── Helpers ──

function normalizeEndpoint(endpoint: string): string {
  let url = endpoint.trim();
  if (!url) return "";
  if (url.startsWith("mock://")) return url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
}

function buildRequestUrl(config: AiProviderConfig): string {
  const base = normalizeEndpoint(config.apiEndpoint);
  if (config.fullUrl) {
    return base;
  }
  if (config.apiFormat === "anthropic") {
    return `${base}/v1/messages`;
  }
  return `${base}/chat/completions`;
}

// ── OpenAI Chat Completions call ──

async function callOpenAi(
  url: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userContent: string,
): Promise<string> {
  const body: OpenAiRequest = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    temperature: 0.3,
    max_tokens: 64,
    stream: false,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMsg = `AI request failed (${response.status})`;
    try {
      const errorData = (await response.json()) as { error?: { message?: string } };
      if (errorData.error?.message) {
        errorMsg = errorData.error.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMsg);
  }

  const data = (await response.json()) as OpenAiResponse;
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

// ── Anthropic Messages call ──

async function callAnthropic(
  url: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userContent: string,
): Promise<string> {
  const body: AnthropicRequest = {
    model,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
    max_tokens: 64,
    temperature: 0.3,
    stream: false,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMsg = `AI request failed (${response.status})`;
    try {
      const errorData = (await response.json()) as { error?: { message?: string } };
      if (errorData.error?.message) {
        errorMsg = errorData.error.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMsg);
  }

  const data = (await response.json()) as AnthropicResponse;
  return data.content?.[0]?.text?.trim() ?? "";
}

// ── Mock ──

const MOCK_TITLES = [
  "今日工作记录",
  "周末计划安排",
  "读书笔记",
  "灵感随手记",
  "项目进度备忘",
  "会议纪要",
  "生活小确幸",
  "技术方案草稿",
  "购物清单",
  "旅行日记",
];

function generateMockTitle(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "无标题";

  const firstLine = trimmed.split(/\n/)[0].replace(/^[#\-*\s]+/, "").trim();
  if (firstLine.length >= 2 && firstLine.length <= 30) {
    return firstLine;
  }

  const idx = trimmed.length % MOCK_TITLES.length;
  const suffix = trimmed.length > 100 ? ` (${trimmed.length}字)` : "";
  return MOCK_TITLES[idx] + suffix;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Public API ──

export interface GenerateTitleOptions {
  config: AiProviderConfig;
  content: string;
}

export async function generateTitle({
  config,
  content,
}: GenerateTitleOptions): Promise<string> {
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    throw new Error("Note content is empty");
  }

  if (config.providerId === "mock" || config.apiEndpoint.startsWith("mock://")) {
    await delay(400 + Math.random() * 300);
    return generateMockTitle(trimmedContent);
  }

  const endpoint = normalizeEndpoint(config.apiEndpoint);
  if (!endpoint) {
    throw new Error("AI API endpoint is not configured");
  }
  if (!config.apiKey.trim()) {
    throw new Error("AI API key is not configured");
  }
  if (!config.model.trim()) {
    throw new Error("AI model is not configured");
  }

  const prompt = config.titlePrompt?.trim() || DEFAULT_TITLE_PROMPT;
  const userContent = trimmedContent.slice(0, 3000);
  const url = buildRequestUrl(config);

  let title: string;
  if (config.apiFormat === "anthropic") {
    title = await callAnthropic(url, config.apiKey.trim(), config.model.trim(), prompt, userContent);
  } else {
    title = await callOpenAi(url, config.apiKey.trim(), config.model.trim(), prompt, userContent);
  }

  if (!title) {
    throw new Error("AI returned empty title");
  }

  return title.replace(/^[""''《》「」\s]+|[""''《》「」\s]+$/g, "").slice(0, 100);
}

export function isAiConfigured(config: AiProviderConfig | undefined): boolean {
  if (!config) return false;
  if (!config.enabled) return false;
  if (config.providerId === "mock") return true;
  return Boolean(
    config.apiEndpoint?.trim() && config.apiKey?.trim() && config.model?.trim(),
  );
}

export function getDefaultTitlePrompt(): string {
  return DEFAULT_TITLE_PROMPT;
}
