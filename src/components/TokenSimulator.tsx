import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, Clock, Hash, Type, Zap, Code2, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MD_ZH_TEXT = `# 什么是生成式人工智能？

生成式人工智能（**Generative AI**）是人工智能的一个分支，专注于创造新内容。

## 核心技术
1. **大语言模型 (LLM)**：如 GPT-4，能够理解和生成自然语言。
2. **扩散模型 (Diffusion Models)**：用于生成高质量图像。

> "AI 不会取代人类，但掌握 AI 的人会取代不掌握 AI 的人。"

### 示例代码
下面是一个简单的 Python 示例：
\`\`\`python
def greet(name):
    print(f"Hello, {name}!")
    
if __name__ == "__main__":
    greet("World")
\`\`\`
`;

const MD_EN_TEXT = `# What is Generative AI?

Generative Artificial Intelligence (**GenAI**) is a type of AI that can create new content and ideas.

## Key Technologies
* **Large Language Models (LLMs)**: Such as GPT-4, designed to understand and generate human-like text.
* **Diffusion Models**: Used for generating high-quality images from text prompts.

> "The future belongs to those who learn to collaborate with artificial intelligence."

### Example Code
Here is a simple example in JavaScript:
\`\`\`javascript
function calculateFibonacci(n) {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

console.log(calculateFibonacci(10)); // Output: 55
\`\`\`
`;

const CODE_TEXT = `import React, { useState, useEffect } from 'react';
import { User, Loader2 } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'user';
  lastActive: string;
}

export const UserDashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Simulate API call
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return <div className="text-red-400 p-4 bg-red-500/10 rounded-lg">User not found</div>;
  }

  return (
    <div className="p-6 border border-zinc-800 rounded-2xl shadow-sm bg-zinc-900/50 backdrop-blur">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-emerald-500/10 rounded-full">
          <User className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-100">{user.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              {user.role}
            </span>
            <span className="text-xs text-zinc-500">
              Active {user.lastActive}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
`;

// A robust tokenizer that splits by Chinese characters, English words, symbols, and preserves exact whitespace/newlines.
const tokenize = (text: string) => {
  return text.match(/[\u4e00-\u9fa5]|[\w]+|[^\w\s\u4e00-\u9fa5]+|\s+/g) || [];
};

const TOKENS = {
  'md-zh': tokenize(MD_ZH_TEXT),
  'md-en': tokenize(MD_EN_TEXT),
  'code': tokenize(CODE_TEXT),
};

type ContentMode = 'md-zh' | 'md-en' | 'code';

export default function TokenSimulator() {
  const [targetSpeed, setTargetSpeed] = useState<number>(20);
  const [mode, setMode] = useState<ContentMode>('md-zh');
  const [isRunning, setIsRunning] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [currentSpeedDisplay, setCurrentSpeedDisplay] = useState(0);

  const outputRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(undefined);
  const lastTimeRef = useRef<number>(0);
  const accumulatedTokensRef = useRef<number>(0);
  const tokenIndexRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastSpeedUpdateRef = useRef<number>(0);
  const tokensSinceLastSpeedUpdateRef = useRef<number>(0);

  const tokens = TOKENS[mode];

  const animate = (time: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
      startTimeRef.current = time - elapsedMs;
      lastSpeedUpdateRef.current = time;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setElapsedMs(time - startTimeRef.current);

    // Fluctuation logic
    const noise = (Math.random() * 0.4) - 0.2; // -20% to +20%
    const pause = Math.random() > 0.98 ? 0 : 1; // 2% chance to pause
    const burst = Math.random() > 0.95 ? 1.4 : 1; // 5% chance to burst
    
    const actualSpeed = targetSpeed * (1 + noise) * pause * burst;

    accumulatedTokensRef.current += (actualSpeed / 1000) * deltaTime;
    const tokensToAdd = Math.floor(accumulatedTokensRef.current);

    if (tokensToAdd > 0) {
      accumulatedTokensRef.current -= tokensToAdd;
      let newTextChunk = '';
      for (let i = 0; i < tokensToAdd; i++) {
        newTextChunk += tokens[tokenIndexRef.current % tokens.length];
        tokenIndexRef.current++;
      }

      setGeneratedText(prev => prev + newTextChunk);
      setTokenCount(prev => prev + tokensToAdd);
      tokensSinceLastSpeedUpdateRef.current += tokensToAdd;
    }

    if (time - lastSpeedUpdateRef.current > 250) {
      const speedTimeDelta = time - lastSpeedUpdateRef.current;
      const calculatedSpeed = (tokensSinceLastSpeedUpdateRef.current / speedTimeDelta) * 1000;
      setCurrentSpeedDisplay(calculatedSpeed);
      lastSpeedUpdateRef.current = time;
      tokensSinceLastSpeedUpdateRef.current = 0;
    }

    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = 0;
      setCurrentSpeedDisplay(0);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, targetSpeed, mode]);

  const handleReset = () => {
    setIsRunning(false);
    setGeneratedText('');
    setTokenCount(0);
    setElapsedMs(0);
    setCurrentSpeedDisplay(0);
    accumulatedTokensRef.current = 0;
    tokenIndexRef.current = 0;
    lastTimeRef.current = 0;
  };

  useEffect(() => {
    handleReset();
  }, [mode]);

  const getSpeedContext = () => {
    if (targetSpeed < 5) return "Slower than reading";
    if (targetSpeed >= 5 && targetSpeed <= 15) return "Comfortable reading";
    if (targetSpeed > 15 && targetSpeed <= 40) return "Fast skimming";
    return "Too fast to read";
  };

  // Append a cursor block if running
  const displayText = generatedText + (isRunning ? '▍' : '');

  return (
    <div className="min-h-screen text-zinc-300 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-zinc-100 tracking-tight">Token Speed Simulator</h1>
              <p className="text-sm text-zinc-500 mt-1">Evaluate LLM output speed and user experience</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-8 backdrop-blur-md shadow-xl">
              
              {/* Speed Control */}
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Target Speed
                  </label>
                  <div className="flex items-baseline gap-1.5 border-b border-zinc-800 pb-1">
                    <input
                      type="number"
                      value={targetSpeed}
                      onChange={(e) => setTargetSpeed(Math.max(1, Number(e.target.value)))}
                      className="w-20 bg-transparent text-right text-3xl font-mono text-emerald-400 focus:outline-none"
                      min="1"
                      max="1000"
                    />
                    <span className="text-sm text-zinc-500 font-mono">tok/s</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="150"
                    value={targetSpeed}
                    onChange={(e) => setTargetSpeed(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-zinc-500 font-mono px-1">
                    <span>1</span>
                    <span>50</span>
                    <span>100</span>
                    <span>150+</span>
                  </div>
                </div>
              </div>

              {/* Content Mode Toggle */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Type className="w-4 h-4 text-emerald-500" />
                  Content Type
                </label>
                <div className="flex flex-col gap-2">
                  <div className="flex p-1 bg-zinc-950/50 rounded-xl border border-zinc-800/80">
                    <button
                      onClick={() => setMode('md-zh')}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        mode === 'md-zh' 
                          ? 'bg-zinc-800 text-zinc-100 shadow-md border border-zinc-700/50' 
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      MD (ZH)
                    </button>
                    <button
                      onClick={() => setMode('md-en')}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        mode === 'md-en' 
                          ? 'bg-zinc-800 text-zinc-100 shadow-md border border-zinc-700/50' 
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      MD (EN)
                    </button>
                  </div>
                  <div className="flex p-1 bg-zinc-950/50 rounded-xl border border-zinc-800/80">
                    <button
                      onClick={() => setMode('code')}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        mode === 'code' 
                          ? 'bg-zinc-800 text-zinc-100 shadow-md border border-zinc-700/50' 
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      Code (React/TS)
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-zinc-800/50">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isRunning
                      ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                      : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  }`}
                >
                  {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  {isRunning ? 'Pause' : 'Start Simulation'}
                </button>
                <button
                  onClick={handleReset}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
                  title="Reset"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Stats Panel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 space-y-2 backdrop-blur-sm">
                <div className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" /> Actual Speed
                </div>
                <div className="text-2xl font-mono text-zinc-100">
                  {currentSpeedDisplay.toFixed(1)} <span className="text-sm text-zinc-600">t/s</span>
                </div>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 space-y-2 backdrop-blur-sm">
                <div className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                  <Hash className="w-3.5 h-3.5" /> Tokens
                </div>
                <div className="text-2xl font-mono text-zinc-100">
                  {tokenCount}
                </div>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 space-y-2 col-span-2 backdrop-blur-sm flex justify-between items-end">
                <div className="space-y-2">
                  <div className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" /> Elapsed Time
                  </div>
                  <div className="text-2xl font-mono text-zinc-100">
                    {(elapsedMs / 1000).toFixed(2)} <span className="text-sm text-zinc-600">s</span>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 text-right pb-1">
                  {getSpeedContext()}
                </div>
              </div>
            </div>
          </div>

          {/* Output Area */}
          <div className="lg:col-span-8 h-[650px] bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl relative overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/5">
            {/* Window Controls */}
            <div className="h-12 border-b border-zinc-800/80 bg-zinc-900/80 flex items-center px-4 gap-4 shrink-0 backdrop-blur-md">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700/80"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700/80"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700/80"></div>
              </div>
              <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500/80 animate-pulse' : 'bg-zinc-700'}`}></span>
                llm-output-stream.log
              </div>
            </div>

            <div 
              ref={outputRef}
              className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar"
            >
              {generatedText.length > 0 ? (
                mode === 'code' ? (
                  <pre className="font-mono text-[15px] leading-relaxed text-zinc-300 whitespace-pre-wrap break-words">
                    {displayText}
                  </pre>
                ) : (
                  <div className="markdown-body">
                    <Markdown remarkPlugins={[remarkGfm]}>{displayText}</Markdown>
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                  <Zap className="w-12 h-12 text-zinc-800" />
                  <p className="font-mono text-sm">Press Start to begin simulation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}