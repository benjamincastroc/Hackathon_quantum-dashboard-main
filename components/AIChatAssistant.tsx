"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, Copy, Check } from "lucide-react";
import { chatSuggestions, getAIResponse } from "@/lib/data";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function formatTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: `## GovWatch AI Assistant Ready

I'm your autonomous anti-corruption audit assistant. I'm currently monitoring **124 government projects** worth **$38.4M** in public funds.

### What I can help you with:
- 🔍 Analyze specific projects for corruption risks
- 📊 Identify anomalous spending patterns
- ⛓️ Verify blockchain audit records
- 📋 Generate comprehensive audit reports
- 🏢 Investigate supplier relationships

Select a suggested prompt below or type your own question to begin.

**Last data sync:** 2 minutes ago | **Confidence:** 92%`,
    timestamp: formatTimestamp(),
  },
];

function MessageContent({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown-like rendering
  const lines = content.split("\n");
  return (
    <div className="group relative">
      <div className="text-xs text-slate-300 leading-relaxed space-y-1">
        {lines.map((line, i) => {
          if (line.startsWith("## ")) {
            return <h3 key={i} className="text-sm font-bold text-white mt-1">{line.replace("## ", "")}</h3>;
          }
          if (line.startsWith("### ")) {
            return <h4 key={i} className="text-xs font-semibold text-slate-200 mt-2">{line.replace("### ", "")}</h4>;
          }
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <p key={i} className="flex items-start gap-1.5">
                <span className="text-blue-400 mt-0.5">•</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: line
                      .replace(/^[-*] /, "")
                      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>")
                      .replace(/`(.*?)`/g, "<code class='text-blue-300 bg-blue-500/15 px-1 py-0.5 rounded text-[10px] font-mono'>$1</code>"),
                  }}
                />
              </p>
            );
          }
          if (line.startsWith("|") && line.endsWith("|")) {
            const cells = line.split("|").filter(Boolean);
            return (
              <div key={i} className="flex gap-0">
                {cells.map((cell, ci) => (
                  <span
                    key={ci}
                    className="text-[10px] px-2 py-0.5 border-b border-white/10 flex-1 font-mono text-slate-400"
                  >
                    {cell.trim()}
                  </span>
                ))}
              </div>
            );
          }
          if (line.startsWith("---")) {
            return <hr key={i} className="border-white/10 my-1" />;
          }
          if (!line.trim()) return <div key={i} className="h-1" />;
          return (
            <p
              key={i}
              dangerouslySetInnerHTML={{
                __html: line
                  .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>")
                  .replace(/`(.*?)`/g, "<code class='text-blue-300 bg-blue-500/15 px-1 py-0.5 rounded text-[10px] font-mono'>$1</code>"),
              }}
            />
          );
        })}
      </div>
      <button
        onClick={handleCopy}
        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-white/10 hover:bg-white/20"
      >
        {copied ? (
          <Check className="w-3 h-3 text-emerald-400" />
        ) : (
          <Copy className="w-3 h-3 text-slate-400" />
        )}
      </button>
    </div>
  );
}

export default function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: text.trim(),
      timestamp: formatTimestamp(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    const delay = 800 + Math.random() * 1200;
    await new Promise((r) => setTimeout(r, delay));

    const aiResponse = getAIResponse(text);
    const assistantMsg: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: aiResponse,
      timestamp: formatTimestamp(),
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMsg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <section className="glass rounded-xl border border-blue-500/10 flex flex-col h-[480px] sm:h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-blue-500/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">GovWatch AI Assistant</h2>
            <p className="text-[10px] text-slate-500">Autonomous anti-corruption auditor</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-2.5 animate-enter", msg.role === "user" && "flex-row-reverse")}
          >
            {/* Avatar */}
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-blue-600 to-purple-600"
                  : "bg-gradient-to-br from-slate-600 to-slate-700"
              )}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-3.5 h-3.5 text-white" />
              ) : (
                <User className="w-3.5 h-3.5 text-white" />
              )}
            </div>

            {/* Bubble */}
            <div className={cn("max-w-[82%]", msg.role === "user" && "items-end flex flex-col")}>
              <div
                className={cn(
                  "px-3.5 py-3 rounded-2xl text-xs",
                  msg.role === "assistant"
                    ? "bg-white/[0.07] border border-white/10 rounded-tl-sm"
                    : "bg-blue-600 text-white rounded-tr-sm"
                )}
              >
                {msg.role === "assistant" ? (
                  <MessageContent content={msg.content} />
                ) : (
                  <p className="text-white text-xs leading-relaxed">{msg.content}</p>
                )}
              </div>
              <span className="text-[10px] text-slate-600 mt-1 px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5 animate-enter">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white/[0.07] border border-white/10 px-3.5 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-3 flex-shrink-0">
          <p className="text-[10px] text-slate-600 mb-2 uppercase tracking-wide font-semibold">
            Suggested queries
          </p>
          <div className="flex flex-wrap gap-1.5">
            {chatSuggestions.slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-[11px] text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2.5 py-1 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-blue-500/10 flex-shrink-0">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500/40 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about risks, contracts, anomalies..."
            className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </form>
    </section>
  );
}
