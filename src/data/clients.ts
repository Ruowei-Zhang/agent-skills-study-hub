import type { ClientSeed } from "./types";

/**
 * Agent 产品清单，来自 agentskills.io/clients（源文件 docs/snippets/clients.jsx）。
 */
export const clients: ClientSeed[] = [
  {
    "name": "Junie",
    "url": "https://junie.jetbrains.com/",
    "docsUrl": "https://junie.jetbrains.com/docs/agent-skills.html",
    "sourceUrl": null,
    "category": "编辑器 / IDE",
    "descriptionEn": "Junie is an LLM-agnostic coding agent built for real-world development. It is built on top of the IntelliJ Platform, so it understands your project the same way your editor does.",
    "descriptionZh": "",
    "orderIndex": 1
  },
  {
    "name": "ZeroClaw",
    "url": "https://www.zeroclawlabs.ai/",
    "docsUrl": "https://docs.zeroclawlabs.ai/master/en/tools/skills.html",
    "sourceUrl": "https://github.com/zeroclaw-labs/zeroclaw",
    "category": "终端 CLI",
    "descriptionEn": "ZeroClaw is an open-source, Rust-first AI agent runtime for local, provider-agnostic personal agents with Agent Skills support.",
    "descriptionZh": "",
    "orderIndex": 2
  },
  {
    "name": "Gemini CLI",
    "url": "https://geminicli.com",
    "docsUrl": "https://geminicli.com/docs/cli/skills/",
    "sourceUrl": "https://github.com/google-gemini/gemini-cli",
    "category": "终端 CLI",
    "descriptionEn": "Gemini CLI is an open-source AI agent that brings the power of Gemini directly into your terminal.",
    "descriptionZh": "",
    "orderIndex": 3
  },
  {
    "name": "Autohand Code CLI",
    "url": "https://autohand.ai/",
    "docsUrl": "https://autohand.ai/docs/working-with-autohand-code/agent-skills.html",
    "sourceUrl": "https://github.com/autohandai/code-cli",
    "category": "终端 CLI",
    "descriptionEn": "Autohand Code CLI is an autonomous LLM-powered coding agent that lives in your terminal. It uses the ReAct (Reason + Act) pattern to understand your codebase, plan changes, and execute them with your approval.",
    "descriptionZh": "",
    "orderIndex": 4
  },
  {
    "name": "OpenCode",
    "url": "https://opencode.ai/",
    "docsUrl": "https://opencode.ai/docs/skills/",
    "sourceUrl": "https://github.com/sst/opencode",
    "category": "终端 CLI",
    "descriptionEn": "OpenCode is an open source agent that helps you write code in your terminal, IDE, or desktop.",
    "descriptionZh": "",
    "orderIndex": 5
  },
  {
    "name": "OpenHands",
    "url": "https://openhands.dev/",
    "docsUrl": "https://docs.openhands.dev/overview/skills",
    "sourceUrl": "https://github.com/OpenHands/OpenHands",
    "category": "平台 / 云端",
    "descriptionEn": "OpenHands is the open platform for cloud coding agents. Scale from one to thousands of agents — open source, model-agnostic, and enterprise-ready.",
    "descriptionZh": "",
    "orderIndex": 6
  },
  {
    "name": "Mux",
    "url": "https://mux.coder.com/",
    "docsUrl": "https://mux.coder.com/agent-skills",
    "sourceUrl": "https://github.com/coder/mux",
    "category": "平台 / 云端",
    "descriptionEn": "Mux makes it easy to run parallel coding agents, each with its own isolated workspace, right from your browser or desktop. Mux is open source and LLM provider-agnostic.",
    "descriptionZh": "",
    "orderIndex": 7
  },
  {
    "name": "Cursor",
    "url": "https://cursor.com/",
    "docsUrl": "https://cursor.com/docs/context/skills",
    "sourceUrl": null,
    "category": "编辑器 / IDE",
    "descriptionEn": "Cursor is an AI editor and coding agent. Use it to understand your codebase, plan and build features, fix bugs, review changes, and work with the tools you already use.",
    "descriptionZh": "",
    "orderIndex": 8
  },
  {
    "name": "Amp",
    "url": "https://ampcode.com/",
    "docsUrl": "https://ampcode.com/manual#agent-skills",
    "sourceUrl": null,
    "category": "终端 CLI",
    "descriptionEn": "Amp is the frontier coding agent that lets you wield the full power of leading models.",
    "descriptionZh": "",
    "orderIndex": 9
  },
  {
    "name": "Letta",
    "url": "https://www.letta.com/",
    "docsUrl": "https://docs.letta.com/letta-code/skills/",
    "sourceUrl": "https://github.com/letta-ai/letta",
    "category": "平台 / 云端",
    "descriptionEn": "Letta is the platform for building stateful agents: AI with advanced memory that can learn and self-improve over time.",
    "descriptionZh": "",
    "orderIndex": 10
  },
  {
    "name": "Firebender",
    "url": "https://firebender.com/",
    "docsUrl": "https://docs.firebender.com/multi-agent/skills",
    "sourceUrl": null,
    "category": "编码智能体",
    "descriptionEn": "Firebender is the first Android-native coding agent that writes features, tests them in the emulator, and fixes issues automatically.",
    "descriptionZh": "",
    "orderIndex": 11
  },
  {
    "name": "Goose",
    "url": "https://block.github.io/goose/",
    "docsUrl": "https://block.github.io/goose/docs/guides/context-engineering/using-skills/",
    "sourceUrl": "https://github.com/block/goose",
    "category": "终端 CLI",
    "descriptionEn": "Goose is an open source, extensible AI agent that goes beyond code suggestions — install, execute, edit, and test with any LLM.",
    "descriptionZh": "",
    "orderIndex": 12
  },
  {
    "name": "GitHub Copilot",
    "url": "https://github.com/",
    "docsUrl": "https://docs.github.com/en/copilot/concepts/agents/about-agent-skills",
    "sourceUrl": "https://github.com/microsoft/vscode-copilot-chat",
    "category": "编辑器 / IDE",
    "descriptionEn": "GitHub Copilot works alongside you directly in your editor, suggesting whole lines or entire functions for you.",
    "descriptionZh": "",
    "orderIndex": 13
  },
  {
    "name": "VS Code",
    "url": "https://code.visualstudio.com/",
    "docsUrl": "https://code.visualstudio.com/docs/copilot/customization/agent-skills",
    "sourceUrl": "https://github.com/microsoft/vscode",
    "category": "编辑器 / IDE",
    "descriptionEn": "Visual Studio Code combines the simplicity of a code editor with what developers need for their core edit-build-debug cycle.",
    "descriptionZh": "",
    "orderIndex": 14
  },
  {
    "name": "Claude Code",
    "url": "https://claude.ai/code",
    "docsUrl": "https://code.claude.com/docs/en/skills",
    "sourceUrl": null,
    "category": "终端 CLI",
    "descriptionEn": "Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. Available in your terminal, IDE, desktop app, and browser.",
    "descriptionZh": "",
    "orderIndex": 15
  },
  {
    "name": "Claude",
    "url": "https://claude.ai/",
    "docsUrl": "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview",
    "sourceUrl": null,
    "category": "平台 / 云端",
    "descriptionEn": "Claude is Anthropic's AI, built for problem solvers. Tackle complex challenges, analyze data, write code, and think through your hardest work.",
    "descriptionZh": "",
    "orderIndex": 16
  },
  {
    "name": "ChatGPT & Codex",
    "url": "https://chatgpt.com/codex/",
    "docsUrl": "https://developers.openai.com/codex/skills/",
    "sourceUrl": "https://github.com/openai/codex",
    "category": "平台 / 云端",
    "descriptionEn": "ChatGPT brings together agents for different kinds of work, including Codex for software development and ChatGPT Work for broader work. Use ChatGPT across desktop, web, and mobile, with Codex also available in your editor and terminal.",
    "descriptionZh": "",
    "orderIndex": 17
  },
  {
    "name": "Piebald",
    "url": "https://piebald.ai",
    "docsUrl": null,
    "sourceUrl": null,
    "category": "编码智能体",
    "descriptionEn": "Piebald is a desktop & web app that makes it easier than ever to do agentic development, while at the same time giving you complete control over the configuration, context, and flow.",
    "descriptionZh": "",
    "orderIndex": 18
  },
  {
    "name": "Factory",
    "url": "https://factory.ai/",
    "docsUrl": "https://docs.factory.ai/cli/configuration/skills",
    "sourceUrl": null,
    "category": "终端 CLI",
    "descriptionEn": "Factory is an AI-native software development platform that works everywhere you do. From IDE to CI/CD — delegate complete tasks like refactors, incident response, and migrations to Droids without changing your tools, models, or workflow.",
    "descriptionZh": "",
    "orderIndex": 19
  },
  {
    "name": "pi",
    "url": "https://shittycodingagent.ai/",
    "docsUrl": "https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md",
    "sourceUrl": "https://github.com/badlogic/pi-mono",
    "category": "终端 CLI",
    "descriptionEn": "Pi is a minimal terminal coding harness. Adapt pi to your workflows, not the other way around.",
    "descriptionZh": "",
    "orderIndex": 20
  },
  {
    "name": "Databricks Genie Code",
    "url": "https://databricks.com/",
    "docsUrl": "https://docs.databricks.com/aws/en/assistant/skills",
    "sourceUrl": null,
    "category": "平台 / 云端",
    "descriptionEn": "Genie Code is an autonomous AI partner purpose-built for data work in Databricks.",
    "descriptionZh": "",
    "orderIndex": 21
  },
  {
    "name": "Agentman",
    "url": "https://agentman.ai/",
    "docsUrl": "https://agentman.ai/agentskills",
    "sourceUrl": null,
    "category": "平台 / 云端",
    "descriptionEn": "Agentman is an agentic healthcare platform. It automates revenue cycle workflows using AI agents without sacrificing control. Every action is testable, traceable, and auditable.",
    "descriptionZh": "",
    "orderIndex": 22
  },
  {
    "name": "TRAE",
    "url": "https://trae.ai/",
    "docsUrl": "https://www.trae.ai/blog/trae_tutorial_0115",
    "sourceUrl": "https://github.com/bytedance/trae-agent",
    "category": "编辑器 / IDE",
    "descriptionEn": "Trae is an adaptive AI IDE that transforms how you work, collaborating with you to run faster.",
    "descriptionZh": "",
    "orderIndex": 23
  },
  {
    "name": "Spring AI",
    "url": "https://docs.spring.io/spring-ai/reference",
    "docsUrl": "https://spring.io/blog/2026/01/13/spring-ai-generic-agent-skills/",
    "sourceUrl": "https://github.com/spring-projects/spring-ai",
    "category": "框架 / 库",
    "descriptionEn": "Spring AI aims to streamline the development of applications that incorporate artificial intelligence functionality without unnecessary complexity.",
    "descriptionZh": "",
    "orderIndex": 24
  },
  {
    "name": "Roo Code",
    "url": "https://roocode.com",
    "docsUrl": "https://docs.roocode.com/features/skills",
    "sourceUrl": "https://github.com/RooCodeInc/Roo-Code",
    "category": "编辑器 / IDE",
    "descriptionEn": "Roo Code puts an entire AI dev team right in your editor, outpacing closed tools with deep project-wide context, multi-step agentic coding, and unmatched developer-centric flexibility.",
    "descriptionZh": "",
    "orderIndex": 25
  },
  {
    "name": "Mistral AI Vibe",
    "url": "https://github.com/mistralai/mistral-vibe",
    "docsUrl": "https://github.com/mistralai/mistral-vibe",
    "sourceUrl": "https://github.com/mistralai/mistral-vibe",
    "category": "终端 CLI",
    "descriptionEn": "Mistral Vibe is a command-line coding assistant powered by Mistral's models. It provides a conversational interface to your codebase, allowing you to use natural language to explore, modify, and interact with your projects through a powerful set of tools.",
    "descriptionZh": "",
    "orderIndex": 26
  },
  {
    "name": "Command Code",
    "url": "https://commandcode.ai/",
    "docsUrl": "https://commandcode.ai/docs/skills",
    "sourceUrl": null,
    "category": "终端 CLI",
    "descriptionEn": "Command Code is a coding agent that continuously learns your coding taste. Our meta neuro-symbolic AI model taste-1 with continuous reinforcement learning combines LLMs with your coding taste.",
    "descriptionZh": "",
    "orderIndex": 27
  },
  {
    "name": "Ona",
    "url": "https://ona.com",
    "docsUrl": "https://ona.com/docs/ona/agents-md#skills-for-repository-specific-workflows",
    "sourceUrl": null,
    "category": "平台 / 云端",
    "descriptionEn": "Ona is a platform for background agents. Run a team of AI software engineers in the cloud. Orchestrated, governed, secured at the kernel.",
    "descriptionZh": "",
    "orderIndex": 28
  },
  {
    "name": "VT Code",
    "url": "https://github.com/vinhnx/vtcode",
    "docsUrl": "https://github.com/vinhnx/vtcode/blob/main/docs/skills/SKILLS_GUIDE.md",
    "sourceUrl": "https://github.com/vinhnx/VTCode",
    "category": "终端 CLI",
    "descriptionEn": "VT Code is an open-source coding agent with LLM-native code understanding and robust shell safety. Supports multiple LLM providers with automatic failover and efficient context management.",
    "descriptionZh": "",
    "orderIndex": 29
  },
  {
    "name": "Qodo",
    "url": "https://www.qodo.ai/",
    "docsUrl": "https://www.qodo.ai/blog/how-i-use-qodos-agent-skills-to-auto-fix-issues-in-pull-requests/",
    "sourceUrl": null,
    "category": "平台 / 云端",
    "descriptionEn": "Qodo is an agentic code integrity platform for reviewing, testing, and writing code, integrating AI across development workflows to strengthen code quality at every stage.",
    "descriptionZh": "",
    "orderIndex": 30
  },
  {
    "name": "Laravel Boost",
    "url": "https://github.com/laravel/boost",
    "docsUrl": "https://laravel.com/docs/12.x/boost#agent-skills",
    "sourceUrl": "https://github.com/laravel/boost",
    "category": "框架 / 库",
    "descriptionEn": "Laravel Boost accelerates AI-assisted development by providing the essential guidelines and agent skills that help AI agents write high-quality Laravel applications that adhere to Laravel best practices.",
    "descriptionZh": "",
    "orderIndex": 31
  },
  {
    "name": "Emdash",
    "url": "https://emdash.sh",
    "docsUrl": "https://docs.emdash.sh/skills",
    "sourceUrl": "https://github.com/generalaction/emdash",
    "category": "编码智能体",
    "descriptionEn": "Emdash is a provider-agnostic desktop app that lets you run multiple coding agents in parallel, each isolated in its own git worktree, either locally or over SSH on a remote machine.",
    "descriptionZh": "",
    "orderIndex": 32
  },
  {
    "name": "Snowflake Cortex Code",
    "url": "https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code",
    "docsUrl": "https://docs.snowflake.com/en/user-guide/cortex-code/extensibility#extensibility-skills",
    "sourceUrl": null,
    "category": "平台 / 云端",
    "descriptionEn": "Cortex Code is an AI-driven intelligent agent integrated into the Snowflake platform, optimized for complex data engineering, analytics, machine learning, and agent-building tasks.",
    "descriptionZh": "",
    "orderIndex": 33
  },
  {
    "name": "Kiro",
    "url": "https://kiro.dev/",
    "docsUrl": "https://kiro.dev/docs/skills/",
    "sourceUrl": null,
    "category": "编辑器 / IDE",
    "descriptionEn": "Kiro helps you do your best work by bringing structure to AI coding with spec-driven development.",
    "descriptionZh": "",
    "orderIndex": 34
  },
  {
    "name": "Workshop",
    "url": "https://workshop.ai/",
    "docsUrl": "https://docs.workshop.ai/core-concepts/working-with-the-agent#create-your-own-agents",
    "sourceUrl": null,
    "category": "终端 CLI",
    "descriptionEn": "Workshop is a cross-platform AI coding agent for building full applications. It supports multi-LLM models, sub-agents, custom agents, and skills — available as a desktop app, web app, and CLI.",
    "descriptionZh": "",
    "orderIndex": 35
  },
  {
    "name": "Google AI Edge Gallery",
    "url": "https://github.com/google-ai-edge/gallery",
    "docsUrl": "https://github.com/google-ai-edge/gallery/tree/main/skills",
    "sourceUrl": "https://github.com/google-ai-edge/gallery",
    "category": "平台 / 云端",
    "descriptionEn": "Google AI Edge Gallery is the premier destination for running the world's most powerful open-source Large Language Models (LLMs) on your mobile device",
    "descriptionZh": "",
    "orderIndex": 36
  },
  {
    "name": "nanobot",
    "url": "https://nanobot.wiki/",
    "docsUrl": "https://nanobot.wiki/docs/0.1.5/use-nanobot/skills",
    "sourceUrl": "https://github.com/HKUDS/nanobot",
    "category": "终端 CLI",
    "descriptionEn": "nanobot is an ultra-lightweight, open-source personal AI agent. It runs across multiple platforms — terminal, Telegram, Discord, Slack, WeChat, and more — with built-in MCP support and a skills system for extensibility.",
    "descriptionZh": "",
    "orderIndex": 37
  },
  {
    "name": "fast-agent",
    "url": "https://fast-agent.ai/",
    "docsUrl": "https://fast-agent.ai/agents/skills/",
    "sourceUrl": "https://github.com/evalstate/fast-agent",
    "category": "框架 / 库",
    "descriptionEn": "fast-agent is a simple, extendable way to interact with LLMs. Excellent for Coding, Evals, ACPX and Skills development.",
    "descriptionZh": "",
    "orderIndex": 38
  },
  {
    "name": "bub",
    "url": "https://bub.build/",
    "docsUrl": "https://bub.build/docs/build/skills/",
    "sourceUrl": "https://github.com/bubbuild/bub",
    "category": "框架 / 库",
    "descriptionEn": "Bub is a lightweight, hook-first Python framework for channel-native agents that live alongside people.",
    "descriptionZh": "",
    "orderIndex": 39
  },
  {
    "name": "Tabnine",
    "url": "https://www.tabnine.com/",
    "docsUrl": "https://docs.tabnine.com/main/getting-started/tabnine-cli/features/agent-skills",
    "sourceUrl": null,
    "category": "编辑器 / IDE",
    "descriptionEn": "Tabnine is an AI engineering platform that combines code assistants, agentic workflows, and enterprise context to help development teams build, review, and maintain software with context-aware AI—while keeping code private, secure, and fully under your control.",
    "descriptionZh": "",
    "orderIndex": 40
  },
  {
    "name": "Vita",
    "url": "https://www.vita-ai.net",
    "docsUrl": "https://www.vita-ai.net/docs/features/agent-skills",
    "sourceUrl": null,
    "category": "编码智能体",
    "descriptionEn": "Vita provides autonomous digital workers with virtual desktops to execute complex workflows. It learns your intent to automate end-to-end tasks like creating and posting engaging social media content.",
    "descriptionZh": "",
    "orderIndex": 41
  },
  {
    "name": "Superconductor",
    "url": "https://superconductor.com/",
    "docsUrl": "https://superconductor.com/docs/project/mcp-and-skills",
    "sourceUrl": null,
    "category": "平台 / 云端",
    "descriptionEn": "Superconductor is a multiplayer workspace for your team and coding agents. Run many agents in the cloud, build together in shared sessions, and ship faster with live app previews and guided code review.",
    "descriptionZh": "",
    "orderIndex": 42
  },
  {
    "name": "Deep Code",
    "url": "https://deepcode.vegamo.cn/en",
    "docsUrl": "https://deepcode.vegamo.cn/en/docs/configuration/agent-skills",
    "sourceUrl": "https://github.com/lessweb/deepcode-cli",
    "category": "终端 CLI",
    "descriptionEn": "Deep Code is an open-source terminal AI coding assistant for the DeepSeek model, supporting deep thinking, reasoning effort control, and extending its capabilities with Skills and MCP.",
    "descriptionZh": "",
    "orderIndex": 43
  },
  {
    "name": "Pulumi Neo",
    "url": "https://www.pulumi.com/product/neo/",
    "docsUrl": "https://www.pulumi.com/docs/ai/skills/",
    "sourceUrl": null,
    "category": "平台 / 云端",
    "descriptionEn": "Pulumi Neo is an AI agent that manages cloud infrastructure with Pulumi. It runs in Pulumi Cloud, the CLI, GitHub, and Slack, and works within your organization's policies and approvals.",
    "descriptionZh": "",
    "orderIndex": 44
  },
  {
    "name": "Hermes Agent",
    "url": "https://hermes-agent.nousresearch.com/",
    "docsUrl": "https://hermes-agent.nousresearch.com/docs/user-guide/features/skills",
    "sourceUrl": "https://github.com/NousResearch/hermes-agent",
    "category": "终端 CLI",
    "descriptionEn": "Hermes Agent is a personal AI agent by Nous Research that runs across a CLI, a desktop app, and messaging platforms. It is open source and model-agnostic, learns across sessions, and drives a real terminal and browser.",
    "descriptionZh": "",
    "orderIndex": 45
  },
  {
    "name": "OpenClaw",
    "url": "https://openclaw.ai/",
    "docsUrl": "https://docs.openclaw.ai/tools/skills",
    "sourceUrl": "https://github.com/openclaw/openclaw",
    "category": "终端 CLI",
    "descriptionEn": "OpenClaw is an open-source personal AI assistant that runs locally and connects to the messaging platforms and tools you already use.",
    "descriptionZh": "",
    "orderIndex": 46
  }
];
