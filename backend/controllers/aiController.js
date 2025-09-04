import natural from "natural";

// Consolidated FAQ list
const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Go to the doctor profile and click 'Book Appointment'. Choose a slot and confirm. You'll get a confirmation in My Appointments.",
  },
  {
    q: "What are the payment options?",
    a: "We accept online payments via Stripe. You can pay during booking or later from My Appointments.",
  },
  {
    q: "How do I cancel an appointment?",
    a: "Open My Appointments, select the appointment you want to cancel and click 'Cancel'. Cancellation rules depend on the doctor's policy.",
  },
  {
    q: "How can I upload my reports?",
    a: "Use the profile page or appointment chat to upload reports; supported formats are JPG, PNG, and PDF.",
  },
  {
    q: "How do I change my profile picture?",
    a: "Go to My Profile and upload a new image. The image will be uploaded to Cloudinary.",
  },
  {
    q: "Is this service available 24/7?",
    a: "Appointment booking is available 24/7, but doctor availability depends on their schedule.",
  },
];

// Handler to answer FAQ-like questions using Jaro-Winkler fuzzy matching
export function faqHandler(req, res) {
  try {
    const { question } = req.body || {};
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: "question is required" });
    }

    const normalized = question.toLowerCase();
    let best = { score: 0, answer: "Sorry, I don't have an answer for that. Try rephrasing or contact support." };

    for (const f of FAQS) {
      const score = natural.JaroWinklerDistance(normalized, f.q.toLowerCase());
      if (score > best.score) best = { score, answer: f.a, q: f.q };
    }

    // confidence threshold
    if (best.score < 0.6) {
      return res.json({ answer: best.answer, matched: false, score: best.score });
    }

    return res.json({ answer: best.answer, matched: true, matchedQuestion: best.q, score: best.score });
  } catch (err) {
    console.error("FAQ handler error:", err);
    return res.status(500).json({ error: "internal error" });
  }
}
