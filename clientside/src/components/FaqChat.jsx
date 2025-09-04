import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import Chatbot from "./Chatbot";

export default function FaqChat() {
  const { backendUrl } = useContext(AppContext);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/user/ai/faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      const json = await res.json();
      setAnswer(json.answer || "No answer");
    } catch (err) {
      setAnswer("Error contacting server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Help & FAQs</h2>
      <p className="mb-4 text-sm text-gray-600">Ask a question about booking, payments, or accounts.</p>
      <div className="flex gap-2 mb-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type your question..."
        />
        <button onClick={ask} className="bg-primary text-white px-4 rounded" disabled={loading}>
          {loading ? "..." : "Ask"}
        </button>
      </div>
      {answer && (
        <div className="p-4 bg-stone-100 rounded">
          <strong>Answer:</strong>
          <p className="mt-2">{answer}</p>
        </div>
      )}
  {/* Integrated chatbot UI */}
  <Chatbot />
    </div>
  );
}
