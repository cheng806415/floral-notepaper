import type { AiProviderConfig } from "../settings/types";

export type ApiFormat = "openai" | "anthropic";

export interface AiProviderPreset {
  id: string;
  name: string;
  apiEndpoint: string;
  defaultModel: string;
  apiFormat: ApiFormat;
}

export const AI_PROVIDER_PRESETS: AiProviderPreset[] = [
  {
    id: "mock",
    name: "Mock (本地测试)",
    apiEndpoint: "mock://local",
    defaultModel: "mock-model",
    apiFormat: "openai",
  },
  {
    id: "google",
    name: "Google",
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.5-flash",
    apiFormat: "openai",
  },
  {
    id: "openai",
    name: "OpenAI",
    apiEndpoint: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    apiFormat: "openai",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    apiEndpoint: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    apiFormat: "openai",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    apiEndpoint: "https://api.anthropic.com/v1",
    defaultModel: "claude-3-haiku-20240307",
    apiFormat: "anthropic",
  },
  {
    id: "xai",
    name: "xAI",
    apiEndpoint: "https://api.x.ai/v1",
    defaultModel: "grok-2",
    apiFormat: "openai",
  },
  {
    id: "z-ai",
    name: "Z.ai",
    apiEndpoint: "https://api.z.ai/v1",
    defaultModel: "glm-4-flash",
    apiFormat: "openai",
  },
  {
    id: "z-ai-plan",
    name: "Z.ai Plan",
    apiEndpoint: "https://api.z.ai/v1",
    defaultModel: "glm-4-flash",
    apiFormat: "openai",
  },
  {
    id: "minimax-global",
    name: "MiniMax Global",
    apiEndpoint: "https://api.minimax.io/v1",
    defaultModel: "abab6.5s-chat",
    apiFormat: "openai",
  },
  {
    id: "kimi-global",
    name: "Kimi Global",
    apiEndpoint: "https://api.moonshot.cn/v1",
    defaultModel: "moonshot-v1-8k",
    apiFormat: "openai",
  },
  {
    id: "byteplus",
    name: "BytePlus",
    apiEndpoint: "https://api.byteplus.com/v1",
    defaultModel: "doubao-lite-32k",
    apiFormat: "openai",
  },
  {
    id: "byteplus-plan",
    name: "BytePlus Plan",
    apiEndpoint: "https://api.byteplus.com/v1",
    defaultModel: "doubao-lite-32k",
    apiFormat: "openai",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    apiEndpoint: "https://openrouter.ai/api/v1",
    defaultModel: "openai/gpt-4o-mini",
    apiFormat: "openai",
  },
  {
    id: "novita",
    name: "Novita",
    apiEndpoint: "https://api.novita.ai/v3/openai",
    defaultModel: "deepseek/deepseek-r1",
    apiFormat: "openai",
  },
  {
    id: "infinigence-global",
    name: "无问芯穹 Global",
    apiEndpoint: "https://api.infinigence.com/v1",
    defaultModel: "deepseek-v3",
    apiFormat: "openai",
  },
  {
    id: "infinigence-global-plan",
    name: "无问芯穹 Global Plan",
    apiEndpoint: "https://api.infinigence.com/v1",
    defaultModel: "deepseek-v3",
    apiFormat: "openai",
  },
  {
    id: "infinigence-cn",
    name: "无问芯穹 CN",
    apiEndpoint: "https://api.infinigence.cn/v1",
    defaultModel: "deepseek-v3",
    apiFormat: "openai",
  },
  {
    id: "infinigence-cn-plan",
    name: "无问芯穹 CN Plan",
    apiEndpoint: "https://api.infinigence.cn/v1",
    defaultModel: "deepseek-v3",
    apiFormat: "openai",
  },
  {
    id: "aws",
    name: "AWS",
    apiEndpoint: "https://bedrock-runtime.{region}.amazonaws.com",
    defaultModel: "anthropic.claude-3-haiku-20240307-v1:0",
    apiFormat: "openai",
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI",
    apiEndpoint: "https://{resource}.openai.azure.com/openai",
    defaultModel: "gpt-4o-mini",
    apiFormat: "openai",
  },
  {
    id: "vercel-ai-gateway",
    name: "Vercel AI Gateway",
    apiEndpoint: "https://ai-gateway.vercel.sh/v1",
    defaultModel: "gpt-4o-mini",
    apiFormat: "openai",
  },
  {
    id: "ollama-cloud",
    name: "Ollama Cloud",
    apiEndpoint: "https://ollama.ai/v1",
    defaultModel: "llama3.1",
    apiFormat: "openai",
  },
  {
    id: "bigmodel",
    name: "Bigmodel",
    apiEndpoint: "https://open.bigmodel.cn/api/paas/v4",
    defaultModel: "glm-4-flash",
    apiFormat: "openai",
  },
  {
    id: "bigmodel-plan",
    name: "Bigmodel Plan",
    apiEndpoint: "https://open.bigmodel.cn/api/paas/v4",
    defaultModel: "glm-4-flash",
    apiFormat: "openai",
  },
  {
    id: "minimax-cn",
    name: "MiniMax CN",
    apiEndpoint: "https://api.minimax.chat/v1",
    defaultModel: "abab6.5s-chat",
    apiFormat: "openai",
  },
  {
    id: "kimi-cn",
    name: "Kimi CN",
    apiEndpoint: "https://api.moonshot.cn/v1",
    defaultModel: "moonshot-v1-8k",
    apiFormat: "openai",
  },
  {
    id: "huoshan",
    name: "火山引擎",
    apiEndpoint: "https://ark.cn-beijing.volces.com/api/v3",
    defaultModel: "doubao-lite-32k",
    apiFormat: "openai",
  },
  {
    id: "huoshan-plan",
    name: "火山引擎 Plan",
    apiEndpoint: "https://ark.cn-beijing.volces.com/api/v3",
    defaultModel: "doubao-lite-32k",
    apiFormat: "openai",
  },
  {
    id: "huoshan-agent-plan",
    name: "火山引擎 Agent Plan",
    apiEndpoint: "https://ark.cn-beijing.volces.com/api/v3",
    defaultModel: "doubao-lite-32k",
    apiFormat: "openai",
  },
  {
    id: "aliyun",
    name: "阿里云",
    apiEndpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen-turbo",
    apiFormat: "openai",
  },
  {
    id: "aliyun-plan",
    name: "阿里云 Plan",
    apiEndpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen-turbo",
    apiFormat: "openai",
  },
  {
    id: "tencent",
    name: "腾讯云",
    apiEndpoint: "https://api.hunyuan.cloud.tencent.com/v1",
    defaultModel: "hunyuan-lite",
    apiFormat: "openai",
  },
  {
    id: "xiaomi-mimo",
    name: "Xiaomi MIMO",
    apiEndpoint: "https://api.mimo.xiaomi.com/v1",
    defaultModel: "mimo-lite",
    apiFormat: "openai",
  },
  {
    id: "xiaomi-mimo-plan",
    name: "Xiaomi MIMO Plan",
    apiEndpoint: "https://api.mimo.xiaomi.com/v1",
    defaultModel: "mimo-lite",
    apiFormat: "openai",
  },
  {
    id: "siliconflow",
    name: "硅基流动",
    apiEndpoint: "https://api.siliconflow.cn/v1",
    defaultModel: "deepseek-ai/DeepSeek-V3",
    apiFormat: "openai",
  },
  {
    id: "molizhou",
    name: "模力方舟",
    apiEndpoint: "https://api.molizhou.com/v1",
    defaultModel: "qwen2.5-7b-instruct",
    apiFormat: "openai",
  },
  {
    id: "ppio",
    name: "PPIO",
    apiEndpoint: "https://api.ppio.ai/v1",
    defaultModel: "deepseek-ai/DeepSeek-V3",
    apiFormat: "openai",
  },
];

export function findProviderPreset(id: string): AiProviderPreset | undefined {
  return AI_PROVIDER_PRESETS.find((p) => p.id === id);
}

export function applyProviderPreset(
  preset: AiProviderPreset,
  existing?: Partial<AiProviderConfig>,
): Partial<AiProviderConfig> {
  return {
    apiEndpoint: preset.apiEndpoint,
    apiFormat: preset.apiFormat,
    model: existing?.model || preset.defaultModel,
  };
}