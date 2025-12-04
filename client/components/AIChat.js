"use client";
import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "Hi! I have access to your health data. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", { message: userMsg });
      setMessages((prev) => [...prev, { role: "system", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Error connecting to AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 h-96 shadow-2xl rounded-lg border border-gray-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-blue-600 p-3 text-white flex justify-between items-center">
            <span className="font-bold flex items-center gap-2">
              🤖 Dr. AI Assistant
            </span>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-grow p-3 overflow-y-auto bg-gray-50 space-y-3"
            ref={scrollRef}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-xs flex gap-1 items-center">
                Thinking <Loader2 className="animate-spin w-3 h-3" />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-2 border-t flex gap-2 bg-white"
          >
            <input
              className="flex-grow border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="How is my sleep?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105"
        aria-label="Open AI Chat"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
}
