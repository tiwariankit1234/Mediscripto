import React from "react";

export default function ChatbotEmbed({ src, height = 600 }) {
  // src: URL where prescripto-chatbot is served (http://localhost:3000 or deployed URL)
  return (
    <div className="my-6">
      <p className="text-sm text-gray-600 mb-2">Open full Chatbot UI (embedded):</p>
      {src ? (
        <iframe
          title="Prescripto Chatbot"
          src={src}
          style={{ width: "100%", height: `${height}px`, border: "1px solid #e5e7eb" }}
        />
      ) : (
        <div className="p-4 border rounded bg-stone-50">Provide the chatbot app URL via the <code>src</code> prop to embed it here.</div>
      )}
    </div>
  );
}
