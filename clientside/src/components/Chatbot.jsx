import React, { useState, useRef, useEffect, useContext } from "react";
import "./Chatbot.css";
import { AppContext } from "../context/AppContext";
import GeminiService from "../services/geminiService";

const Chatbot = () => {
  const { backendUrl } = useContext(AppContext);
  const geminiService = new GeminiService(backendUrl);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Prescripto assistant. I can help with booking, payments, and general guidance. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(inputMessage);

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm unable to connect to the AI service right now. Please try again later.",
        isBot: true,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your Prescripto assistant. I can help with booking, payments, and general guidance. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    geminiService.resetChat();
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const quickActions = [
    "I have a fever, what should I do?",
    "Home remedies for sore throat",
    "How to treat a headache?",
    "Book an appointment",
    "Find a specialist",
    "Cold and flu remedies",
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="doctor-avatar">🩺</div>
            <div>
              <h3>Prescripto Assistant</h3>
              <p>Health Guidance & Appointments</p>
            </div>
          </div>
          <div className="chat-actions">
            <button onClick={clearChat} className="clear-btn" title="Clear chat">
              🗑️
            </button>
            <button onClick={() => setIsOpen(false)} className="close-btn" title="Close chat">
              ✕
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isBot ? "bot-message" : "user-message"} ${
                message.isError ? "error-message" : ""
              }`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message bot-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="quick-actions">
            <p>Quick actions:</p>
            <div className="quick-actions-buttons">
              {quickActions.map((action, index) => (
                <button key={index} onClick={() => handleQuickAction(action)} className="quick-action-btn">
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-container">
          <div className="chat-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about symptoms, get remedies, health advice, or book an appointment..."
              disabled={isLoading}
              rows="1"
            />
            <button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} className="send-btn">
              📤
            </button>
          </div>
          <p className="disclaimer">
            ⚠️ For emergencies, call emergency services immediately. This chatbot provides general information only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
