<div align="center">

# Token Speed Simulator

**A visual tool to simulate and evaluate LLM token output speeds with realistic fluctuations.**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/yaki1210/Token-Speed-Simulator)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)

一个用于模拟和评估 LLM token 输出速度并带有真实波动的可视化工具。

<img width="2560" height="1440" alt="Snipaste_2026-04-24_06-07-12" src="https://github.com/user-attachments/assets/f18c7174-b49d-4609-a836-1e81d24cd465" />

<img width="2560" height="1440" alt="Snipaste_2026-04-24_06-06-49" src="https://github.com/user-attachments/assets/529d3983-b54e-4b6d-83bd-8007daf5e1a8" />

https://yaki1210.github.io/Token-Speed-Simulator/
</div>

---

## Features / 功能特性

- **Adjustable Target Speed** — Set token output speed from 1 to 1000 tok/s via input field and slider
- **Realistic Fluctuation** — Simulates real LLM output variance: random noise (±20%), occasional pauses (2% chance), and burst acceleration (5% chance at 1.4×)
- **Three Content Modes** — Switch between Chinese Markdown, English Markdown, and React/TypeScript code
- **Smart Tokenizer** — Chinese characters split individually, English words split by word, symbols and whitespace preserved
- **Real-time Stats** — Live actual speed, token count, elapsed time, and reading experience indicators
- **Terminal-style Output** — Streamed output in a simulated terminal window with blinking cursor
- **Dark Theme** — Clean dark UI with emerald accent colors and smooth entry animations

---

- **可调目标速度** — 通过输入框和滑动条设置 1-1000 tok/s 的 token 输出速度
- **真实波动模拟** — 模拟真实 LLM 输出的随机性：噪声波动（±20%）、偶发暂停（2% 概率）、突发加速（5% 概率，1.4 倍速）
- **三种内容模式** — 支持中文 Markdown、英文 Markdown 和 React/TypeScript 代码
- **智能分词** — 中文字符逐字切分，英文按单词切分，符号和空白单独保留
- **实时统计** — 实时显示实际速度、token 数量、已用时间和阅读体验描述
- **终端风格输出** — 仿真终端窗口中逐 token 流式输出，带闪烁光标
- **暗色主题** — 翠绿色强调色的暗色 UI，带平滑入场动画

<!-- 在此处添加功能展示截图 -->
<!--
<img src="路径/到/功能截图.png" alt="Feature Demo" width="800" />
-->

---

## Tech Stack / 技术栈

| Technology | Purpose |
|---|---|
| React 19 | UI Framework / UI 框架 |
| TypeScript | Type Safety / 类型安全 |
| Vite 6 | Build Tool / 构建工具 |
| Tailwind CSS 4 | Styling / 样式 |
| Motion | Animations / 动画 |
| react-markdown + remark-gfm | Markdown Rendering / Markdown 渲染 |
| Lucide React | Icons / 图标 |

---

## Getting Started / 快速开始

### Prerequisites / 前置条件

- [Node.js](https://nodejs.org/) (v18+ recommended)

### Installation / 安装

```bash
# Clone the repository / 克隆仓库
git clone https://github.com/yaki1210/Token-Speed-Simulator.git
cd Token-Speed-Simulator

# Install dependencies / 安装依赖
npm install
```

### Run / 运行

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

应用将在 `http://localhost:3000` 启动。

### Build / 构建

```bash
npm run build
npm run preview
```

---

## Available Scripts / 可用脚本

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (port 3000) / 启动开发服务器（端口 3000） |
| `npm run build` | Production build / 生产构建 |
| `npm run preview` | Preview production build / 预览生产构建 |
| `npm run clean` | Clean dist directory / 清理 dist 目录 |
| `npm run lint` | TypeScript type check / TypeScript 类型检查 |

---

## Project Structure / 项目结构

```
src/
├── main.tsx                # App entry / 应用入口
├── App.tsx                 # Root component / 根组件
├── index.css               # Global styles / 全局样式
└── components/
    └── TokenSimulator.tsx  # Core simulator component / 核心模拟器组件
```

---

## How It Works / 工作原理

The simulator uses `requestAnimationFrame` to drive a frame-rate-independent animation loop. On each frame, it calculates how many tokens should be generated based on the elapsed time and target speed, then renders them character by character with realistic variance injected:

Simulator 使用 `requestAnimationFrame` 驱动帧率无关的动画循环。每一帧根据已用时间和目标速度计算应生成的 token 数量，并注入真实波动后逐字符渲染：

1. **Base Speed / 基础速度** — Target tok/s set by the user / 用户设置的目标 tok/s
2. **Noise / 噪声** — ±20% random offset per interval / 每个间隔 ±20% 随机偏移
3. **Pause / 暂停** — 2% chance of full stop / 2% 概率完全暂停
4. **Burst / 突发** — 5% chance at 1.4× speed / 5% 概率以 1.4 倍速加速
5. **Measurement / 测量** — Actual speed sampled every 250ms / 每 250ms 采样实际速度

---

## License / 许可证

MIT

---

<div align="center">

Built with [Google AI Studio](https://ai.google.dev/) · Made by [yaki1210](https://github.com/yaki1210)

使用 [Google AI Studio](https://ai.google.dev/) 构建 · 由 [yaki1210](https://github.com/yaki1210) 制作

</div>
