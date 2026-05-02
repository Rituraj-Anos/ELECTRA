"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChatStore, useSessionStore } from "@/lib/store";
import { streamChat } from "@/lib/api";
import type { Message } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

const SUGGESTIONS = [
  "How do I register to vote?",
  "What is the Electoral College?",
  "How are votes counted?",
  "What is a primary election?",
  "What ID do I need to vote?",
  "How does ranked-choice voting work?",
];

export default function ChatPage() {
  const { messages, addMessage, appendToLastMessage, setStreaming, isStreaming } = useChatStore();
  const { sessionId, currentModule } = useSessionStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const doSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim(), timestamp: new Date() };
      addMessage(userMsg);
      setInput("");
      setStreaming(true);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };
      addMessage(assistantMsg);

      const chatMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

      await streamChat(
        chatMessages,
        sessionId || "",
        currentModule || undefined,
        (token) => appendToLastMessage(token),
        () => setStreaming(false),
        (err) => {
          appendToLastMessage(`\n\n_Error: ${err}_`);
          setStreaming(false);
        },
      );
    },
    [isStreaming, messages, sessionId, currentModule, addMessage, appendToLastMessage, setStreaming],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSend(input);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 72px)",
        background: "var(--bg-cream)",
        overflow: "hidden",
      }}
    >
      {/* Header — always visible */}
      <div style={{ flexShrink: 0, padding: "var(--sp-md) var(--sp-lg) 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-tag">AI Assistant</span>
            <h1 style={{ fontFamily: "var(--font-heading)", marginTop: 4, fontSize: "var(--text-h2)" }}>
              Ask ELECTRA
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: 0 }}>
              Ask anything about elections, voting, and civic participation
            </p>
          </motion.div>
        </div>
      </div>

      {/* Suggestion chips — only when empty */}
      {isEmpty && (
        <div style={{ flexShrink: 0, padding: "var(--sp-sm) var(--sp-lg) 0" }}>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              maxWidth: 800,
              margin: "0 auto",
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 4,
              scrollbarWidth: "none",
            }}
          >
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => doSend(q)}
                style={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1.5px solid var(--accent)",
                  background: "var(--bg-cream)",
                  color: "var(--accent)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "background 0.15s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--accent-light)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-cream)";
                }}
              >
                {q}
              </button>
            ))}
          </motion.div>
        </div>
      )}

      {/* Messages area — scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "var(--sp-sm) var(--sp-lg)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--sp-md)",
                paddingTop: "15vh",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "var(--r-xl)",
                  background: "var(--accent-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: "40ch" }}>
                Ask about voter registration, election systems, how votes are counted, or anything election-related.
              </p>
            </motion.div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-sm)" }}>
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar — pinned to bottom */}
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid var(--border-light)",
          padding: "var(--sp-sm) var(--sp-lg)",
          background: "var(--bg-cream)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: "var(--sp-xs)" }}>
          <textarea
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about elections..."
            rows={1}
            disabled={isStreaming}
            style={{ resize: "none", minHeight: 48, maxHeight: 120, borderRadius: "var(--r-lg)", flex: 1 }}
            aria-label="Chat message input"
          />
          <button
            className="btn btn-primary"
            onClick={() => doSend(input)}
            disabled={!input.trim() || isStreaming}
            style={{
              borderRadius: "var(--r-lg)",
              padding: "0 var(--sp-md)",
              opacity: !input.trim() || isStreaming ? 0.4 : 1,
            }}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
      style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "var(--sp-sm) var(--sp-md)",
          borderRadius: isUser
            ? "var(--r-xl) var(--r-xl) var(--r-sm) var(--r-xl)"
            : "var(--r-xl) var(--r-xl) var(--r-xl) var(--r-sm)",
          background: isUser ? "var(--accent)" : "var(--bg-white)",
          color: isUser ? "white" : "var(--text-heading)",
          border: isUser ? "none" : "1px solid var(--border-light)",
          fontSize: "var(--text-sm)",
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          boxShadow: isUser ? "0 4px 12px rgba(232,56,13,0.2)" : "var(--shadow-sm)",
        }}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
