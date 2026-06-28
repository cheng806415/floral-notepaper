import type { ApiFormat } from "../settings/types";
import type { AiProviderConfig } from "../settings/types";

export interface AiModelPreset {
  id: string;
  name: string;
  multimodal?: boolean;
}

export interface AiProviderPreset {
  id: string;
  name: string;
  apiEndpoint: string;
  apiFormat: ApiFormat;
  models: AiModelPreset[];
}

export const AI_PROVIDER_PRESETS: AiProviderPreset[] = [
  {
    id: "openai",
    name: "OpenAI",
    apiEndpoint: "https://api.openai.com/v1",
    apiFormat: "openai",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "gpt-4o", name: "GPT-4o", multimodal: true },
      { id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
      { id: "gpt-4.1-nano", name: "GPT-4.1 Nano" },
      { id: "gpt-4.1", name: "GPT-4.1", multimodal: true },
      { id: "o3-mini", name: "o3 Mini (reasoning)" },
      { id: "o4-mini", name: "o4 Mini (reasoning)" },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    apiEndpoint: "https://api.anthropic.com",
    apiFormat: "anthropic",
    models: [
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku" },
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", multimodal: true },
      { id: "claude-haiku-4-20250514", name: "Claude 4 Haiku" },
      { id: "claude-sonnet-4-20250514", name: "Claude 4 Sonnet", multimodal: true },
      { id: "claude-opus-4-20250514", name: "Claude 4 Opus", multimodal: true },
    ],
  },
  {
    id: "google",
    name: "Google (Gemini OpenAI兼容)",
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiFormat: "openai",
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", multimodal: true },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", multimodal: true },
      { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", multimodal: true },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    apiEndpoint: "https://api.deepseek.com",
    apiFormat: "openai",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat (V3)" },
      { id: "deepseek-reasoner", name: "DeepSeek Reasoner (R1)" },
    ],
  },
  {
    id: "xai",
    name: "xAI (Grok)",
    apiEndpoint: "https://api.x.ai/v1",
    apiFormat: "openai",
    models: [
      { id: "grok-3-mini", name: "Grok 3 Mini" },
      { id: "grok-3", name: "Grok 3", multimodal: true },
      { id: "grok-4", name: "Grok 4", multimodal: true },
    ],
  },
  {
    id: "z-ai",
    name: "Z.ai (智谱)",
    apiEndpoint: "https://open.bigmodel.cn/api/paas/v4",
    apiFormat: "openai",
    models: [
      { id: "glm-4-flash", name: "GLM-4 Flash (免费)" },
      { id: "glm-4-flashx", name: "GLM-4 FlashX (免费)" },
      { id: "glm-4-plus", name: "GLM-4 Plus" },
      { id: "glm-4-long", name: "GLM-4 Long (长文本)" },
      { id: "glm-4-air", name: "GLM-4 Air" },
      { id: "glm-z1-flash", name: "GLM Z1 Flash (reasoning)" },
      { id: "glm-4v-plus", name: "GLM-4V Plus", multimodal: true },
    ],
  },
  {
    id: "bigmodel",
    name: "Bigmodel (智谱AI)",
    apiEndpoint: "https://open.bigmodel.cn/api/paas/v4",
    apiFormat: "openai",
    models: [
      { id: "glm-4-flash", name: "GLM-4 Flash (免费)" },
      { id: "glm-4.7-flash", name: "GLM-4.7 Flash" },
      { id: "glm-4-plus", name: "GLM-4 Plus" },
      { id: "glm-z1-flash", name: "GLM Z1 Flash (reasoning)" },
    ],
  },
  {
    id: "kimi-cn",
    name: "Kimi (月之暗面)",
    apiEndpoint: "https://api.moonshot.cn/v1",
    apiFormat: "openai",
    models: [
      { id: "moonshot-v1-8k", name: "Moonshot V1 8K" },
      { id: "moonshot-v1-32k", name: "Moonshot V1 32K" },
      { id: "moonshot-v1-128k", name: "Moonshot V1 128K (长文本)" },
      { id: "kimi-k2.5", name: "Kimi K2.5" },
      { id: "kimi-k2", name: "Kimi K2 (reasoning)" },
    ],
  },
  {
    id: "kimi-global",
    name: "Kimi Global",
    apiEndpoint: "https://api.moonshot.cn/v1",
    apiFormat: "openai",
    models: [
      { id: "moonshot-v1-8k", name: "Moonshot V1 8K" },
      { id: "moonshot-v1-128k", name: "Moonshot V1 128K" },
      { id: "kimi-k2.5", name: "Kimi K2.5" },
      { id: "kimi-k2", name: "Kimi K2 (reasoning)" },
    ],
  },
  {
    id: "minimax-cn",
    name: "MiniMax (国内)",
    apiEndpoint: "https://api.minimax.chat/v1",
    apiFormat: "openai",
    models: [
      { id: "abab6.5s-chat", name: "abab6.5s Chat" },
      { id: "MiniMax-Text-01", name: "MiniMax-Text-01" },
      { id: "MiniMax-M1", name: "MiniMax-M1 (长文本)" },
    ],
  },
  {
    id: "minimax-global",
    name: "MiniMax Global",
    apiEndpoint: "https://api.minimax.io/v1",
    apiFormat: "openai",
    models: [
      { id: "abab6.5s-chat", name: "abab6.5s Chat" },
      { id: "MiniMax-Text-01", name: "MiniMax-Text-01" },
      { id: "MiniMax-M1", name: "MiniMax-M1 (长文本)" },
    ],
  },
  {
    id: "aliyun",
    name: "阿里云百炼 (Qwen)",
    apiEndpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiFormat: "openai",
    models: [
      { id: "qwen-turbo", name: "Qwen Turbo (免费)" },
      { id: "qwen-plus", name: "Qwen Plus" },
      { id: "qwen-max", name: "Qwen Max" },
      { id: "qwen-long", name: "Qwen Long (长文本)" },
      { id: "qwen3-turbo", name: "Qwen3 Turbo" },
      { id: "qwen3-max", name: "Qwen3 Max (reasoning)" },
      { id: "qwen-vl-plus", name: "Qwen VL Plus", multimodal: true },
    ],
  },
  {
    id: "huoshan",
    name: "火山引擎 (豆包)",
    apiEndpoint: "https://ark.cn-beijing.volces.com/api/v3",
    apiFormat: "openai",
    models: [
      { id: "doubao-lite-32k", name: "Doubao Lite 32K (免费)" },
      { id: "doubao-pro-32k", name: "Doubao Pro 32K" },
      { id: "doubao-1.5-pro-32k", name: "Doubao 1.5 Pro 32K" },
      { id: "doubao-1.5-thinking-pro", name: "Doubao 1.5 Thinking Pro (reasoning)" },
    ],
  },
  {
    id: "siliconflow",
    name: "硅基流动 (SiliconFlow)",
    apiEndpoint: "https://api.siliconflow.cn/v1",
    apiFormat: "openai",
    models: [
      { id: "Qwen/Qwen2.5-7B-Instruct", name: "Qwen2.5-7B (免费)" },
      { id: "deepseek-ai/DeepSeek-V3", name: "DeepSeek V3" },
      { id: "deepseek-ai/DeepSeek-R1", name: "DeepSeek R1 (reasoning)" },
      { id: "Qwen/Qwen3-8B", name: "Qwen3-8B (免费)" },
      { id: "Qwen/Qwen2.5-72B-Instruct", name: "Qwen2.5-72B" },
    ],
  },
  {
    id: "tencent",
    name: "腾讯云 (混元)",
    apiEndpoint: "https://api.hunyuan.cloud.tencent.com/v1",
    apiFormat: "openai",
    models: [
      { id: "hunyuan-lite", name: "Hunyuan Lite (免费)" },
      { id: "hunyuan-standard", name: "Hunyuan Standard" },
      { id: "hunyuan-pro", name: "Hunyuan Pro" },
      { id: "hunyuan-turbos-latest", name: "Hunyuan Turbo S" },
      { id: "hunyuan-thinking", name: "Hunyuan Thinking (reasoning)" },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter (聚合)",
    apiEndpoint: "https://openrouter.ai/api/v1",
    apiFormat: "openai",
    models: [
      { id: "openai/gpt-4o-mini", name: "GPT-4o Mini (via OpenRouter)" },
      { id: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", multimodal: true },
      { id: "google/gemini-2.5-flash-001", name: "Gemini 2.5 Flash", multimodal: true },
      { id: "deepseek/deepseek-chat", name: "DeepSeek Chat" },
      { id: "deepseek/deepseek-r1", name: "DeepSeek R1 (reasoning)" },
    ],
  },
  {
    id: "novita",
    name: "Novita AI",
    apiEndpoint: "https://api.novita.ai/v3/openai",
    apiFormat: "openai",
    models: [
      { id: "deepseek/deepseek_v3", name: "DeepSeek V3" },
      { id: "deepseek/deepseek-r1", name: "DeepSeek R1" },
      { id: "meta-llama/llama-3.1-8b-instruct", name: "Llama 3.1 8B" },
    ],
  },
  {
    id: "infinigence-cn",
    name: "无问芯穹 CN",
    apiEndpoint: "https://api.infinigence.cn/v1",
    apiFormat: "openai",
    models: [
      { id: "deepseek-v3", name: "DeepSeek V3" },
      { id: "Qwen2.5-72B-Instruct", name: "Qwen2.5-72B" },
    ],
  },
  {
    id: "infinigence-global",
    name: "无问芯穹 Global",
    apiEndpoint: "https://api.infinigence.com/v1",
    apiFormat: "openai",
    models: [
      { id: "deepseek-v3", name: "DeepSeek V3" },
      { id: "Qwen2.5-72B-Instruct", name: "Qwen2.5-72B" },
    ],
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI",
    apiEndpoint: "https://{resource}.openai.azure.com/openai",
    apiFormat: "openai",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "gpt-4o", name: "GPT-4o", multimodal: true },
      { id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
      { id: "gpt-4.1", name: "GPT-4.1", multimodal: true },
    ],
  },
  {
    id: "aws",
    name: "AWS Bedrock",
    apiEndpoint: "https://bedrock-runtime.{region}.amazonaws.com",
    apiFormat: "openai",
    models: [
      { id: "anthropic.claude-3-5-haiku-20241022-v1:0", name: "Claude 3.5 Haiku" },
      { id: "anthropic.claude-3-5-sonnet-20241022-v2:0", name: "Claude 3.5 Sonnet" },
      { id: "anthropic.claude-sonnet-4-20250514-v1:0", name: "Claude 4 Sonnet", multimodal: true },
    ],
  },
  {
    id: "vercel-ai-gateway",
    name: "Vercel AI Gateway",
    apiEndpoint: "https://ai-gateway.vercel.sh/v1",
    apiFormat: "openai",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "claude-3-5-haiku", name: "Claude 3.5 Haiku" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    ],
  },
  {
    id: "ollama-cloud",
    name: "Ollama (本地)",
    apiEndpoint: "http://localhost:11434/v1",
    apiFormat: "openai",
    models: [
      { id: "llama3.1", name: "Llama 3.1" },
      { id: "qwen2.5", name: "Qwen 2.5" },
      { id: "qwen3", name: "Qwen3" },
      { id: "deepseek-r1:7b", name: "DeepSeek R1 7B" },
    ],
  },
  {
    id: "xiaomi-mimo",
    name: "小米 MIMO",
    apiEndpoint: "https://api.mimo.xiaomi.com/v1",
    apiFormat: "openai",
    models: [
      { id: "mimo-lite", name: "MIMO Lite" },
      { id: "mimo-pro", name: "MIMO Pro" },
      { id: "mimo-v2-pro", name: "MIMO V2 Pro" },
    ],
  },
  {
    id: "byteplus",
    name: "BytePlus",
    apiEndpoint: "https://api.byteplus.com/v1",
    apiFormat: "openai",
    models: [
      { id: "doubao-lite-32k", name: "Doubao Lite 32K" },
      { id: "doubao-pro-32k", name: "Doubao Pro 32K" },
      { id: "doubao-1.5-pro-32k", name: "Doubao 1.5 Pro 32K" },
    ],
  },
  {
    id: "molizhou",
    name: "模力方舟",
    apiEndpoint: "https://api.molizhou.com/v1",
    apiFormat: "openai",
    models: [
      { id: "qwen2.5-7b-instruct", name: "Qwen2.5-7B" },
      { id: "deepseek-v3", name: "DeepSeek V3" },
      { id: "deepseek-r1", name: "DeepSeek R1 (reasoning)" },
    ],
  },
  {
    id: "ppio",
    name: "PPIO",
    apiEndpoint: "https://api.ppio.ai/v1",
    apiFormat: "openai",
    models: [
      { id: "deepseek-ai/DeepSeek-V3", name: "DeepSeek V3" },
      { id: "deepseek-ai/DeepSeek-R1", name: "DeepSeek R1" },
      { id: "Qwen/Qwen3-8B", name: "Qwen3-8B" },
    ],
  },
  {
    id: "baichuan",
    name: "百川智能",
    apiEndpoint: "https://api.baichuan-ai.com/v1",
    apiFormat: "openai",
    models: [
      { id: "Baichuan4", name: "Baichuan4" },
      { id: "Baichuan4-Turbo", name: "Baichuan4 Turbo" },
    ],
  },
  {
    id: "yi-01",
    name: "零一万物 (Yi)",
    apiEndpoint: "https://api.lingyiwanwu.com/v1",
    apiFormat: "openai",
    models: [
      { id: "yi-lightning", name: "Yi Lightning (免费)" },
      { id: "yi-large", name: "Yi Large" },
      { id: "yi-vision", name: "Yi Vision", multimodal: true },
    ],
  },
  {
    id: "stepfun",
    name: "阶跃星辰 (StepFun)",
    apiEndpoint: "https://api.stepfun.com/v1",
    apiFormat: "openai",
    models: [
      { id: "step-1-flash", name: "Step 1 Flash (免费)" },
      { id: "step-1", name: "Step 1" },
      { id: "step-2", name: "Step 2" },
      { id: "step-1v-8k", name: "Step 1V", multimodal: true },
    ],
  },
  {
    id: "iflytek",
    name: "讯飞星火",
    apiEndpoint: "https://spark-api-open.xf-yun.com/v1",
    apiFormat: "openai",
    models: [
      { id: "lite", name: "Spark Lite (免费)" },
      { id: "generalv3.5", name: "Spark 3.5" },
      { id: "generalv4.0", name: "Spark 4.0 Ultra" },
    ],
  },
];

// Plan versions point to the same API as their base provider
const PLAN_PROVIDER_IDS: Record<string, string> = {
  "z-ai-plan": "z-ai",
  "bigmodel-plan": "bigmodel",
  "huoshan-plan": "huoshan",
  "huoshan-agent-plan": "huoshan",
  "aliyun-plan": "aliyun",
  "byteplus-plan": "byteplus",
  "infinigence-global-plan": "infinigence-global",
  "infinigence-cn-plan": "infinigence-cn",
  "xiaomi-mimo-plan": "xiaomi-mimo",
};

const PLAN_NAMES: Record<string, string> = {
  "z-ai-plan": "Z.ai Plan",
  "bigmodel-plan": "Bigmodel Plan",
  "huoshan-plan": "火山引擎 Plan",
  "huoshan-agent-plan": "火山引擎 Agent Plan",
  "aliyun-plan": "阿里云 Plan",
  "byteplus-plan": "BytePlus Plan",
  "infinigence-global-plan": "无问芯穹 Global Plan",
  "infinigence-cn-plan": "无问芯穹 CN Plan",
  "xiaomi-mimo-plan": "Xiaomi MIMO Plan",
};

// Add Plan variants by cloning from base
for (const [planId, baseId] of Object.entries(PLAN_PROVIDER_IDS)) {
  const base = AI_PROVIDER_PRESETS.find((p) => p.id === baseId);
  if (base) {
    AI_PROVIDER_PRESETS.push({
      ...base,
      id: planId,
      name: PLAN_NAMES[planId] ?? planId,
    });
  }
}

// Add Mock provider for local testing
AI_PROVIDER_PRESETS.push({
  id: "mock",
  name: "Mock (本地测试)",
  apiEndpoint: "mock://local",
  apiFormat: "openai",
  models: [
    { id: "mock-model", name: "Mock Model" },
  ],
});

export function findProviderPreset(id: string): AiProviderPreset | undefined {
  return AI_PROVIDER_PRESETS.find((p) => p.id === id);
}

export function getDefaultAiConfig(): AiProviderConfig {
  return {
    enabled: false,
    configMode: "preset",
    providerId: "",
    apiEndpoint: "",
    fullUrl: false,
    apiKey: "",
    model: "",
    apiFormat: "openai",
    multimodal: false,
    titlePrompt: "请为以下笔记内容生成一个简洁、准确的标题，不超过20个字，不要加引号，不要加任何前缀或解释：",
  };
}

const CUSTOM_MODE_COMMON_MODELS: AiModelPreset[] = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "gpt-4o", name: "GPT-4o", multimodal: true },
  { id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
  { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku" },
  { id: "claude-sonnet-4-20250514", name: "Claude 4 Sonnet", multimodal: true },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", multimodal: true },
  { id: "deepseek-chat", name: "DeepSeek Chat (V3)" },
  { id: "deepseek-reasoner", name: "DeepSeek R1 (reasoning)" },
];

export function getCustomCommonModels(): AiModelPreset[] {
  return CUSTOM_MODE_COMMON_MODELS;
}

export function applyProviderPreset(
  preset: AiProviderPreset,
  existing?: Partial<AiProviderConfig>,
): Partial<AiProviderConfig> {
  const defaultModel = preset.models[0]?.id ?? "";
  const defaultMultimodal = preset.models[0]?.multimodal ?? false;
  const existingModel = existing?.model;
  const modelExists = existingModel && preset.models.some((m) => m.id === existingModel);
  return {
    configMode: "preset",
    providerId: preset.id,
    apiEndpoint: preset.apiEndpoint,
    apiFormat: preset.apiFormat,
    fullUrl: false,
    model: modelExists ? existingModel : defaultModel,
    multimodal: modelExists
      ? (preset.models.find((m) => m.id === existingModel)?.multimodal ?? false)
      : defaultMultimodal,
  };
}
