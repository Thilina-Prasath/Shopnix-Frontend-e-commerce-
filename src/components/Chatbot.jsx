import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiLoader,
  FiShoppingBag,
} from "react-icons/fi";
import axios from "axios";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "ආයුබෝවන්! මම Shopnix සහායක. මගෙන් ඕනෑම දෙයක් අසන්න.",
    },
  ]);

  const messagesEndRef = useRef(null);

  // අහඹු User ID එකක් සාදා ගැනීම (Rasa හට මතක තබාගැනීම සඳහා)
  const [userId] = useState(() => "user_" + Math.floor(Math.random() * 10000));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      // Rasa REST Webhook එක වෙත පණිවිඩය යැවීම
      const response = await axios.post(
        "http://localhost:5005/webhooks/rest/webhook",
        {
          sender: userId,
          message: userMessage,
        },
      );

      // Rasa වෙතින් ලැබෙන පිළිතුරු (Array) එකින් එක UI එකට එක් කිරීම
      if (response.data && response.data.length > 0) {
        response.data.forEach((botReply) => {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: botReply.text },
          ]);
        });
      } else {
        // Bot ගෙන් හිස් පිළිතුරක් පැමිණියහොත්
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "මට එය පැහැදිලි මදි. කරුණාකර නැවත පවසන්න." },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "කණගාටුයි, සර්වර් දෝෂයක් මතු විය. Rasa Server එක ධාවනය වන්නේදැයි පරික්ෂා කරන්න.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="w-[calc(100vw-2rem)] sm:w-[92vw] max-w-[390px] h-[min(70dvh,480px)] sm:h-[540px] bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl border border-zinc-100 flex flex-col mb-3 sm:mb-4 overflow-hidden"
          >
            <div className="relative bg-zinc-950 p-4 sm:p-5 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#9b6b43,transparent_35%)] opacity-60" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-[#9b6b43] font-black shadow">
                    <FiShoppingBag
                      size={20}
                      className="sm:w-[22px] sm:h-[22px]"
                    />
                  </div>

                  <div>
                    <h3 className="text-white font-black text-sm sm:text-base">
                      Shopnix Assistant
                    </h3>
                    <p className="text-zinc-300 text-[11px] sm:text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Online support
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
                >
                  <FiX size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-[#FAF7F2] flex flex-col gap-2.5 sm:gap-3">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[82%] px-3.5 py-2.5 sm:px-4 sm:py-3 text-[13px] sm:text-sm leading-relaxed rounded-2xl sm:rounded-3xl shadow-sm ${
                      msg.sender === "user"
                        ? "bg-zinc-950 text-white rounded-br-md"
                        : "bg-white text-zinc-700 rounded-bl-md border border-zinc-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl sm:rounded-3xl rounded-bl-md shadow-sm border border-zinc-100 flex items-center gap-2">
                    <FiLoader
                      className="animate-spin text-[#9b6b43]"
                      size={14}
                    />
                    <span className="text-[11px] sm:text-xs text-zinc-500">
                      Shopnix is typing...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 sm:p-4 bg-white border-t border-zinc-100">
              <div className="flex items-center gap-2 bg-[#FAF7F2] rounded-xl sm:rounded-2xl p-1.5 sm:p-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about products, orders..."
                  className="flex-1 bg-transparent text-[13px] sm:text-sm px-2.5 sm:px-3 py-2 outline-none placeholder:text-zinc-400"
                  disabled={isLoading}
                />

                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-zinc-950 hover:bg-[#9b6b43] disabled:bg-zinc-300 text-white w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition shadow-sm shrink-0"
                >
                  <FiSend size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-950 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-[#9b6b43] transition"
      >
        {isOpen ? (
          <FiX size={22} className="sm:w-6 sm:h-6" />
        ) : (
          <FiMessageSquare size={22} className="sm:w-[25px] sm:h-[25px]" />
        )}
      </motion.button>
    </div>
  );
}
