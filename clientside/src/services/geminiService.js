// Simple service wrapper used by the Chatbot UI.
// It calls a backend endpoint `/api/user/ai/chat` which should proxy to an LLM.
export default class GeminiService {
  constructor(backendUrl) {
    this.backendUrl = backendUrl || import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  }

  async sendMessage(text) {
    try {
      const res = await fetch(`${this.backendUrl}/api/user/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      if (!res.ok) throw new Error("AI backend error");
      const json = await res.json();
      return json.reply || json.text || "";
    } catch (err) {
      // fallback canned replies to keep the UI functional
      console.warn("AI backend unavailable, using fallback reply", err);
      return this.fallbackReply(text);
    }
  }

  fallbackReply(text) {
    const lower = text.toLowerCase();
    if (lower.includes("fever")) return "For fever: rest, hydrate, and take acetaminophen if needed. Seek care for high or persistent fever.";
    if (lower.includes("headache")) return "For headaches: rest, hydrate, cold compress, OTC pain relief as directed. Seek care for severe or sudden headaches.";
    if (lower.includes("book")) return "I can help you book an appointment — open the doctor's profile and choose a slot, or tell me which specialty you need.";
    return "Sorry, I couldn't understand fully. Try rephrasing or ask about booking, payments, or profile updates.";
  }

  resetChat() {
    // no-op for this wrapper
  }
}
